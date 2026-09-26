"""Prepare a compact exterior asset with diffuse lighting baked into one atlas.

Read a copy of the authored .blend; never modify the source scene. Metallic trim,
acrylic faces and glazing retain physical materials. Other surfaces carry baked
diffuse light, so a mobile browser does not need the scene's dozens of lights.
"""
import argparse
from array import array
import json
import math
import sys
from pathlib import Path

import bpy

parser = argparse.ArgumentParser()
parser.add_argument('--source', required=True)
parser.add_argument('--output', required=True)
args = parser.parse_args(sys.argv[sys.argv.index('--')+1:])
output = Path(args.output).resolve()
output.mkdir(parents=True, exist_ok=True)
bpy.ops.wm.open_mainfile(filepath=str(Path(args.source).resolve()))
scene = bpy.context.scene
print('Preparing exterior geometry', flush=True)
for obj in list(bpy.data.objects):
    if obj.type == 'MESH' and obj.parent:
        world = obj.matrix_world.copy()
        obj.parent = None
        obj.matrix_world = world

# Merge compatible surfaces to reduce the number of browser draw calls. Remove
# invisible vessels and the distant blocks outside the constrained camera views.
for obj in list(bpy.data.objects):
    if obj.type not in {'MESH', 'LIGHT'} or obj.hide_render or (obj.type == 'MESH' and abs(obj.location.x) > 24):
        bpy.data.objects.remove(obj, do_unlink=True)

groups = {}
for obj in list(bpy.data.objects):
    if obj.type != 'MESH':
        continue
    bpy.ops.object.select_all(action='DESELECT')
    obj.select_set(True)
    bpy.context.view_layer.objects.active = obj
    if obj.data.users > 1:
        obj.data = obj.data.copy()
    for modifier in list(obj.modifiers):
        try:
            bpy.ops.object.modifier_apply(modifier=modifier.name)
        except RuntimeError:
            obj.modifiers.remove(modifier)
    if obj.get('om_section') == 'foliage' and len(obj.data.polygons) > 1200:
        # Thin leaves are kept; reduction is restricted to heavier stem/soil meshes.
        if 'leaves' not in obj.name.lower():
            modifier = obj.modifiers.new('Context mesh reduction', 'DECIMATE')
            modifier.ratio = .28
            bpy.ops.object.modifier_apply(modifier=modifier.name)
    key = (obj.get('om_section', 'interior'), tuple(m.name if m else '' for m in obj.data.materials))
    groups.setdefault(key, []).append(obj)

for (section, _), objects in groups.items():
    bpy.ops.object.select_all(action='DESELECT')
    for obj in objects:
        obj.select_set(True)
    bpy.context.view_layer.objects.active = objects[0]
    bpy.ops.object.join()
    obj = bpy.context.object
    obj.name = section + ' / ' + (obj.data.materials[0].name if obj.data.materials else 'surface')
    obj['om_section'] = section

# The source light rig stays available solely for offline baking. The glTF
# export below selects only meshes and does not include these lights.
print('Geometry merged into', len(groups), 'surface groups', flush=True)

bake_objects = []
bake_materials = set()
for obj in bpy.data.objects:
    if obj.type != 'MESH' or obj.get('om_section') == 'foliage':
        continue
    material = obj.data.materials[0] if obj.data.materials else None
    if not material:
        continue
    bsdf = material.node_tree.nodes.get('Principled BSDF') if material.use_nodes else None
    if not bsdf or bsdf.inputs['Metallic'].default_value > .75 or bsdf.inputs['Transmission Weight'].default_value > .1 or (bsdf.inputs['Emission Strength'].default_value > 0 and max(bsdf.inputs['Emission Color'].default_value[:3]) > 0):
        continue
    if obj.name.startswith('exterior / Wet asphalt'):
        continue
    bake_objects.append(obj)
    bake_materials.update(obj.data.materials)

atlas = bpy.data.images.new('Exterior diffuse illumination', width=2048, height=2048, alpha=False, float_buffer=True)
atlas.colorspace_settings.name = 'Linear Rec.709'
for obj in bake_objects:
    while obj.data.uv_layers:
        obj.data.uv_layers.remove(obj.data.uv_layers[0])
    obj.data.uv_layers.new(name='Baked surface')
for material in bake_materials:
    node = material.node_tree.nodes.new('ShaderNodeTexImage')
    node.name = 'Baked surface target'
    node.image = atlas
    material.node_tree.nodes.active = node

bpy.ops.object.select_all(action='DESELECT')
for obj in bake_objects:
    obj.select_set(True)
bpy.context.view_layer.objects.active = bake_objects[0]
bpy.ops.object.mode_set(mode='EDIT')
bpy.ops.mesh.select_all(action='SELECT')
bpy.ops.uv.smart_project(angle_limit=math.radians(70), island_margin=.003)
# Smart projection can retain independently packed object UV domains. Pack the
# complete multi-object selection together before sharing one lighting image.
bpy.ops.uv.select_all(action='SELECT')
bpy.ops.uv.pack_islands(rotate=True, margin=.003)
bpy.ops.object.mode_set(mode='OBJECT')
scene.render.engine = 'CYCLES'
scene.cycles.samples = 64
scene.cycles.use_adaptive_sampling = True
scene.cycles.adaptive_threshold = .04
scene.cycles.sample_clamp_indirect = 3
scene.render.bake.margin = 8
scene.render.bake.use_pass_direct = True
scene.render.bake.use_pass_indirect = True
scene.render.bake.use_pass_color = True
try:
    prefs = bpy.context.preferences.addons['cycles'].preferences
    prefs.compute_device_type = 'METAL'
    prefs.get_devices()
    for device in prefs.devices:
        device.use = device.type == 'METAL'
    scene.cycles.device = 'GPU' if any(d.use for d in prefs.devices) else 'CPU'
except Exception:
    scene.cycles.device = 'CPU'
print('Baking', len(bake_objects), 'surface groups using', scene.cycles.device, flush=True)
bpy.ops.object.bake(type='DIFFUSE')

# Preserve radiance beyond PNG's 0–1 range using one shared multiplier, rather
# than clipping the bright storefront. The browser restores it as emission.
pixels = array('f', [0]) * len(atlas.pixels)
atlas.pixels.foreach_get(pixels)
values = sorted(max(pixels[i:i+3]) for i in range(0, len(pixels), 64))
scale = max(1., values[int(len(values)*.999)])
for i in range(0, len(pixels), 4):
    for c in range(3):
        pixels[i+c] = min(1., pixels[i+c] / scale)
atlas.pixels.foreach_set(pixels)
atlas.filepath_raw = str(output / 'diffuse-light.png')
atlas.file_format = 'PNG'
atlas.save()

for material in bake_materials:
    nodes, links = material.node_tree.nodes, material.node_tree.links
    old = nodes.get('Principled BSDF')
    roughness = old.inputs['Roughness'].default_value
    nodes.clear()
    surface = nodes.new('ShaderNodeBsdfPrincipled')
    surface.inputs['Base Color'].default_value = (0,0,0,1)
    surface.inputs['Roughness'].default_value = roughness
    surface.inputs['Emission Strength'].default_value = scale
    tex = nodes.new('ShaderNodeTexImage')
    tex.image = atlas
    links.new(tex.outputs['Color'], surface.inputs['Emission Color'])
    out = nodes.new('ShaderNodeOutputMaterial')
    links.new(surface.outputs[0], out.inputs[0])
    material['bakedDiffuse'] = True

bpy.ops.object.select_all(action='DESELECT')
meshes = [obj for obj in bpy.data.objects if obj.type == 'MESH']
for obj in meshes:
    obj.select_set(True)
    # Baked contact shadows are the primary grounding; no shadow maps are exported.
    obj['staticSurface'] = True
bpy.ops.export_scene.gltf(filepath=str(output/'storefront.glb'), export_format='GLB',
    use_selection=True, export_cameras=False, export_lights=False, export_extras=True,
    export_animations=False, export_apply=True)
triangles = sum(sum(len(face.vertices)-2 for face in obj.data.polygons) for obj in meshes)
report = {'meshGroups':len(meshes), 'triangles':triangles, 'bakedSurfaceGroups':len(bake_objects),
          'lightingAtlas':[2048,2048], 'diffuseRadianceScale':scale,
          'modelBytes':(output/'storefront.glb').stat().st_size}
(output/'asset-report.json').write_text(json.dumps(report,indent=2))
print(json.dumps(report), flush=True)
# Save a copy for inspecting the same baked asset, without changing its source.
bpy.ops.wm.save_as_mainfile(filepath=str(output/'baked-exterior.blend'))
