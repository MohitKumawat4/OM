"""Add street fixtures, bake road surface maps, and inspect the runtime asset.

Run after export_exterior.py. Source scenes remain untouched. Inspection images
are offline renders of the exported asset, not browser screenshots.
"""
import argparse
import json
import sys
from pathlib import Path
import bpy

parser=argparse.ArgumentParser()
parser.add_argument('--directory',required=True)
args=parser.parse_args(sys.argv[sys.argv.index('--')+1:])
directory=Path(args.directory).resolve()
bpy.ops.wm.open_mainfile(filepath=str(directory/'baked-exterior.blend'))
scene=bpy.context.scene

# Denoise the computed radiance atlas, not a reference photograph. Small area
# lights produce Monte Carlo noise that becomes conspicuous on a close facade.
# Filtering is an offline material-preparation step; the browser does no denoising.
atlas=next(image for image in bpy.data.images if image.name=='Exterior diffuse illumination')
filter_scene=bpy.data.scenes.new('Offline illumination filtering')
filter_scene.render.engine='BLENDER_EEVEE_NEXT'
filter_scene.render.resolution_x=4;filter_scene.render.resolution_y=4;filter_scene.render.resolution_percentage=100
filter_scene.view_settings.view_transform='Standard';filter_scene.view_settings.look='None'
filter_scene.view_settings.exposure=0;filter_scene.view_settings.gamma=1
camera_data=bpy.data.cameras.new('Filter camera')
camera_obj=bpy.data.objects.new('Filter camera',camera_data);filter_scene.collection.objects.link(camera_obj);filter_scene.camera=camera_obj
filter_scene.use_nodes=True
nodes=filter_scene.node_tree.nodes;nodes.clear()
source=nodes.new('CompositorNodeImage');source.image=atlas
denoise=nodes.new('CompositorNodeDenoise');denoise.use_hdr=True
destination=nodes.new('CompositorNodeOutputFile');destination.base_path=str(directory)
destination.file_slots[0].path='diffuse-light-clean'
destination.format.file_format='PNG';destination.format.color_mode='RGB';destination.format.color_depth='8'
filter_scene.node_tree.links.new(source.outputs['Image'],denoise.inputs['Image'])
filter_scene.node_tree.links.new(denoise.outputs['Image'],destination.inputs[0])
print('Filtering computed illumination',flush=True)
bpy.ops.render.render(scene=filter_scene.name)
clean=bpy.data.images.load(str(directory/'diffuse-light-clean0001.png'))
for mat in bpy.data.materials:
    if mat.use_nodes:
        for node in mat.node_tree.nodes:
            if node.type=='TEX_IMAGE' and node.image==atlas:node.image=clean
bpy.context.window.scene=scene
bpy.data.scenes.remove(filter_scene)
bpy.data.objects.remove(camera_obj,do_unlink=True);bpy.data.cameras.remove(camera_data)

# The camera stays outside. Keep the hero lettering intact and simplify the
# sub-pixel lettering, shelving and foliage that previously dominated the file.
for obj in list(bpy.data.objects):
    if obj.type!='MESH':continue
    ratio=None
    if obj.name.startswith('foliage /'):ratio=.16 if 'leaves' in obj.name else .2
    elif obj.name.startswith('interior /') and len(obj.data.polygons)>5000:ratio=.18
    if ratio is not None:
        bpy.ops.object.select_all(action='DESELECT');obj.select_set(True);bpy.context.view_layer.objects.active=obj
        modifier=obj.modifiers.new('Exterior distance simplification','DECIMATE');modifier.ratio=ratio
        bpy.ops.object.modifier_apply(modifier=modifier.name)
print('Exterior distance detail optimized',flush=True)

def material(name,color,metal=0,rough=.4,glow=0):
    m=bpy.data.materials.new(name);m.use_nodes=True
    bsdf=m.node_tree.nodes.get('Principled BSDF')
    bsdf.inputs['Base Color'].default_value=(*color,1)
    bsdf.inputs['Metallic'].default_value=metal
    bsdf.inputs['Roughness'].default_value=rough
    bsdf.inputs['Emission Color'].default_value=(*color,1)
    bsdf.inputs['Emission Strength'].default_value=glow
    return m

metal=material('Street fixture powder coat',(.022,.028,.034),.6,.38)
bronze=material('Street fixture brass fastener',(.22,.16,.08),.85,.3)
diffuser=material('Street luminaire diffuser',(.9,.65,.32),0,.3,2)
fixtures=[]
def box(name,location,size,mat):
    bpy.ops.mesh.primitive_cube_add(size=1,location=(location[0],-location[2],location[1]))
    obj=bpy.context.object;obj.name=name;obj.dimensions=(size[0],size[2],size[1])
    bpy.ops.object.transform_apply(location=False,rotation=False,scale=True)
    obj.data.materials.append(mat)
    bevel=obj.modifiers.new('Fixture edge radius','BEVEL');bevel.width=.01;bevel.segments=2
    bpy.ops.object.modifier_apply(modifier=bevel.name)
    fixtures.append(obj)
    return obj

for x in [-17,-10,11,20]:
    bpy.ops.mesh.primitive_cone_add(vertices=16,radius1=.065,radius2=.042,depth=5.6,location=(x,-4.5,2.3))
    pole=bpy.context.object;pole.name='Tapered streetlight pole';pole.data.materials.append(metal);fixtures.append(pole)
    for face in pole.data.polygons:face.use_smooth=True
    box('Streetlight base flange',(x,-.47,4.5),(.23,.05,.23),metal)
    box('Streetlight service hatch',(x,.05,4.565),(.075,.3,.013),metal)
    box('Streetlight outreach',(x,5.08,4.9),(.08,.09,.85),metal)
    box('Streetlight housing',(x,5.03,5.33),(.31,.1,.76),metal)
    box('Streetlight glass diffuser',(x,4.973,5.33),(.25,.012,.62),diffuser)
    for offset in [-.08,.08]:
        box('Base fixing',(x+offset,-.43,4.5),(.035,.025,.035),bronze)

fixture_materials=[metal,bronze,diffuser]
fixture_groups=[[obj for obj in fixtures if obj.data.materials[0]==mat] for mat in fixture_materials]
for mat,group in zip(fixture_materials,fixture_groups):
    bpy.ops.object.select_all(action='DESELECT')
    for obj in group:obj.select_set(True)
    bpy.context.view_layer.objects.active=group[0]
    bpy.ops.object.join();bpy.context.object.name='exterior / '+mat.name

# Preserve authored asphalt relief as a tiled normal map. Baking happens once
# here; a browser performs ordinary texture lookups, not noise generation.
road=next(obj for obj in bpy.data.objects if obj.name.startswith('exterior / Wet asphalt'))
road_mat=road.data.materials[0]
nodes,links=road_mat.node_tree.nodes,road_mat.node_tree.links
bsdf=nodes.get('Principled BSDF')
bpy.ops.mesh.primitive_plane_add(size=2,location=(0,0,-100))
tile=bpy.context.object;tile.name='Temporary road map baking plane';tile.data.materials.append(road_mat)
noise=next(node for node in nodes if node.type=='TEX_NOISE')
noise.inputs['Scale'].default_value=130
bump=next(node for node in nodes if node.type=='BUMP')
bump.inputs['Distance'].default_value=.012
bump.inputs['Strength'].default_value=.4
normal=bpy.data.images.new('Asphalt surface normal',width=1024,height=1024,alpha=False)
normal.colorspace_settings.name='Non-Color'
target=nodes.new('ShaderNodeTexImage');target.image=normal;nodes.active=target
bpy.ops.object.select_all(action='DESELECT');tile.select_set(True);bpy.context.view_layer.objects.active=tile
scene.cycles.samples=8
print('Baking road detail',flush=True)
bpy.ops.object.bake(type='NORMAL')
normal.filepath_raw=str(directory/'road-normal.png');normal.file_format='PNG';normal.save()
links.remove(bsdf.inputs['Normal'].links[0])
normal_node=nodes.new('ShaderNodeNormalMap');normal_node.inputs['Strength'].default_value=.5
links.new(target.outputs['Color'],normal_node.inputs['Color']);links.new(normal_node.outputs[0],bsdf.inputs['Normal'])
bpy.data.objects.remove(tile,do_unlink=True)
# One tile represents two metres; road UVs are planar world-space coordinates.
uv=road.data.uv_layers.active or road.data.uv_layers.new(name='Road surface')
for polygon in road.data.polygons:
    for loop in polygon.loop_indices:
        point=road.matrix_world@road.data.vertices[road.data.loops[loop].vertex_index].co
        uv.data[loop].uv=(point.x/2,point.y/2)

bpy.ops.object.select_all(action='DESELECT')
meshes=[obj for obj in bpy.data.objects if obj.type=='MESH']
for obj in meshes:obj.select_set(True)
bpy.ops.export_scene.gltf(filepath=str(directory/'storefront.glb'),export_format='GLB',use_selection=True,
    export_cameras=False,export_lights=False,export_extras=True,export_animations=False,export_apply=True,
    export_draco_mesh_compression_enable=True,export_draco_mesh_compression_level=6,
    export_draco_position_quantization=16,export_draco_normal_quantization=10,export_draco_texcoord_quantization=14)
report=json.loads((directory/'asset-report.json').read_text())
report.update(meshGroups=len(meshes),triangles=sum(sum(len(face.vertices)-2 for face in obj.data.polygons) for obj in meshes),
              modelBytes=(directory/'storefront.glb').stat().st_size,roadNormal=[1024,1024])
(directory/'asset-report.json').write_text(json.dumps(report,indent=2))
print(json.dumps(report),flush=True)
bpy.ops.wm.save_as_mainfile(filepath=str(directory/'finished-exterior.blend'))
