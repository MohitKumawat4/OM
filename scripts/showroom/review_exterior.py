"""Render the packaged glTF geometry at the website's exterior camera poses.

EEVEE is an offline inspection renderer, not a Three.js screenshot. Lighting and
tone mapping can differ; these images do not establish browser visual acceptance.
"""
import argparse
import json
import math
import sys
from pathlib import Path
import bpy
from mathutils import Vector

parser=argparse.ArgumentParser()
parser.add_argument('--model',required=True)
parser.add_argument('--cameras',required=True)
parser.add_argument('--output',required=True)
args=parser.parse_args(sys.argv[sys.argv.index('--')+1:])
out=Path(args.output).resolve();out.mkdir(parents=True,exist_ok=True)
bpy.ops.wm.read_factory_settings(use_empty=True)
bpy.ops.import_scene.gltf(filepath=str(Path(args.model).resolve()))
scene=bpy.context.scene
for mat in bpy.data.materials:
    if not mat.use_nodes:continue
    for node in mat.node_tree.nodes:
        if node.type=='BSDF_PRINCIPLED' and mat.name=='Brushed champagne bronze':
            node.inputs['Emission Color'].default_value=node.inputs['Base Color'].default_value
            node.inputs['Emission Strength'].default_value=.12
        if node.type=='BSDF_PRINCIPLED' and node.inputs['Transmission Weight'].default_value>0:
            node.inputs['Transmission Weight'].default_value=0
            node.inputs['Alpha'].default_value=.085
            node.inputs['Roughness'].default_value=.12
            mat.surface_render_method='DITHERED'
world=bpy.data.worlds.new('Runtime dusk inspection');world.use_nodes=True
world.node_tree.nodes.get('Background').inputs['Color'].default_value=(.024,.048,.095,1)
world.node_tree.nodes.get('Background').inputs['Strength'].default_value=.6
scene.world=world
light=bpy.data.lights.new('Restrained warm directional light','SUN');light.energy=.4;light.color=(1,.77,.53);light.use_shadow=False
lamp=bpy.data.objects.new('Runtime directional light',light);bpy.context.collection.objects.link(lamp);lamp.rotation_euler=(.4,-.3,-.5)
camera_data=bpy.data.cameras.new('Website camera');camera_data.sensor_fit='VERTICAL'
camera=bpy.data.objects.new('Website camera',camera_data);bpy.context.collection.objects.link(camera);scene.camera=camera
scene.render.engine='BLENDER_EEVEE_NEXT'
scene.eevee.use_raytracing=False
scene.view_settings.view_transform='AgX';scene.view_settings.look='AgX - Medium High Contrast';scene.view_settings.exposure=0
scene.render.resolution_percentage=100;scene.render.image_settings.file_format='PNG'
shots=json.loads(Path(args.cameras).read_text())
for shot in shots:
    scene.render.resolution_x=shot['width'];scene.render.resolution_y=shot['height']
    pos,tgt=shot['position'],shot['target']
    camera.location=(pos[0],-pos[2],pos[1]);target=Vector((tgt[0],-tgt[2],tgt[1]))
    camera.rotation_euler=(target-camera.location).to_track_quat('-Z','Y').to_euler()
    camera_data.lens=camera_data.sensor_height/(2*math.tan(math.radians(shot['fov'])/2))
    scene.render.filepath=str(out/(shot['name']+'.png'))
    print('Inspecting',shot['name'],flush=True)
    bpy.ops.render.render(write_still=True)
