"""Author the coherent customer space and render real inspection frames.

Run with Blender 4.5+, in background mode. Source coordinates use the website's
Y-up convention; p() converts them to Blender. Context is illustrative, never
claimed as an OM commission. Asset inputs and copy are passed in a JSON brief.
"""
import argparse
import json
import math
import random
import sys
from pathlib import Path

import bpy
from mathutils import Vector

parser = argparse.ArgumentParser()
parser.add_argument('--brief', required=True)
parser.add_argument('--output', required=True)
parser.add_argument('--preview', action='store_true')
parser.add_argument('--all-shots', action='store_true')
parser.add_argument('--no-render', action='store_true')
args = parser.parse_args(sys.argv[sys.argv.index('--') + 1:])
brief = json.loads(Path(args.brief).read_text())
out = Path(args.output)
out.mkdir(parents=True, exist_ok=True)
random.seed(817)
font = bpy.data.fonts.load(brief['fontFile']) if brief.get('fontFile') else None
bpy.ops.object.select_all(action='SELECT')
bpy.ops.object.delete(use_global=False)
scene = bpy.context.scene


def p(v):
    return (v[0], -v[2], v[1])


def rgba(value):
    value = value.lstrip('#')
    c = [int(value[i:i+2], 16) / 255 for i in (0, 2, 4)]
    return tuple(v / 12.92 if v < .04045 else ((v + .055) / 1.055) ** 2.4 for v in c) + (1,)


def mat(name, color, rough=.45, metal=0, noise=0, glow=0):
    m = bpy.data.materials.new(name)
    m.use_nodes = True
    m.diffuse_color = rgba(color)
    m.roughness = rough
    m.metallic = metal
    nodes, links = m.node_tree.nodes, m.node_tree.links
    bsdf = nodes.get('Principled BSDF')
    bsdf.inputs['Base Color'].default_value = rgba(color)
    bsdf.inputs['Roughness'].default_value = rough
    bsdf.inputs['Metallic'].default_value = metal
    if glow:
        bsdf.inputs['Emission Color'].default_value = rgba(color)
        bsdf.inputs['Emission Strength'].default_value = glow
    if noise:
        tex = nodes.new('ShaderNodeTexNoise')
        tex.inputs['Scale'].default_value = 85
        tex.inputs['Detail'].default_value = 3
        bump = nodes.new('ShaderNodeBump')
        bump.inputs['Strength'].default_value = .35
        bump.inputs['Distance'].default_value = noise
        links.new(tex.outputs['Fac'], bump.inputs['Height'])
        links.new(bump.outputs['Normal'], bsdf.inputs['Normal'])
    return m


charcoal = mat('Charcoal satin ACP', '#242629', .28, .6, .012)
black = mat('Anodized black aluminum', '#151819', .3, .72)
bronze = mat('Brushed champagne bronze', '#9e8055', .28, .85, .004)
stone = mat('Warm limestone', '#b8ab99', .3, 0, .022)
plaster = mat('Warm mineral plaster', '#d8cab7', .82, 0, .016)
dark_plaster = mat('Charcoal mineral plaster', '#393a37', .82, 0, .02)
wood = mat('Oak finish PVC', '#9b7650', .42, 0, .014)
dark_wood = mat('Smoked oak finish', '#524734', .46, 0, .015)
acrylic = mat('Warm lit acrylic face', '#ffdfac', .23, .04, glow=3.8)
strip = mat('Warm LED diffuser', '#ffe1ad', .3, glow=7)
paper = mat('Warm uncoated print stock', '#e9e2d6', .85)
ink = mat('Dark green print ink', '#293e35', .65)
concrete = mat('Unfinished concrete', '#626365', .9, noise=.05)
asphalt = mat('Wet asphalt', '#252b30', .3, .02, .055)
paving = mat('Wet dark limestone paving', '#595557', .3, .02, .025)
planter = mat('Charcoal stone planter', '#2f3334', .68, noise=.035)
fabric = mat('Boucle upholstery', '#c8bdae', .96, noise=.028)
ceramics = [mat('Ceramic ' + str(i), color, .3, noise=.007)
            for i, color in enumerate(['#d4c6af', '#88513a', '#50584c', '#343b3d'])]
glass = mat('Architectural clear glass', '#ffffff', .035)
bsdf = glass.node_tree.nodes.get('Principled BSDF')
bsdf.inputs['Transmission Weight'].default_value = 1
bsdf.inputs['IOR'].default_value = 1.46

# Subtle continuous stone grain, rather than a uniform painted slab.
for material, scale, contrast in [(stone, 3.2, .55), (paving, 7, .25)]:
    nodes, links = material.node_tree.nodes, material.node_tree.links
    tex = nodes.new('ShaderNodeTexNoise')
    tex.inputs['Scale'].default_value = scale
    tex.inputs['Detail'].default_value = 6
    tex.inputs['Roughness'].default_value = .72
    ramp = nodes.new('ShaderNodeValToRGB')
    base = material.node_tree.nodes.get('Principled BSDF').inputs['Base Color'].default_value
    ramp.color_ramp.elements[0].color = tuple(v * contrast for v in base[:3]) + (1,)
    ramp.color_ramp.elements[1].color = tuple(base)
    links.new(tex.outputs['Fac'], ramp.inputs[0])
    links.new(ramp.outputs[0], nodes.get('Principled BSDF').inputs['Base Color'])


def box(name, loc, size, material, bevel=.012, group='interior'):
    bpy.ops.mesh.primitive_cube_add(size=1, location=p(loc))
    o = bpy.context.object
    o.name = name
    o.dimensions = (size[0], size[2], size[1])
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    o.data.materials.append(material)
    if bevel:
        mod = o.modifiers.new('Manufactured edge radius', 'BEVEL')
        mod.width = bevel
        mod.segments = 3
        o.modifiers.new('Weighted corner normals', 'WEIGHTED_NORMAL')
    o['om_section'] = group
    return o


def cylinder(name, loc, radius, height, material, radius_top=None, vertices=32):
    bpy.ops.mesh.primitive_cone_add(vertices=vertices, radius1=radius,
        radius2=radius if radius_top is None else radius_top, depth=height, location=p(loc))
    o = bpy.context.object
    o.name = name
    o.data.materials.append(material)
    for polygon in o.data.polygons:
        polygon.use_smooth = True
    o['om_section'] = 'interior'
    bevel = o.modifiers.new('Soft edge', 'BEVEL')
    bevel.width = .008
    bevel.segments = 2
    return o


def label(name, text, loc, size, material, depth=.01, align='CENTER', rotation=None):
    curve = bpy.data.curves.new(name, 'FONT')
    curve.body = text
    if font:
        curve.font = font
    curve.align_x = align
    curve.size = size
    curve.space_character = 1.08
    curve.extrude = depth
    curve.bevel_depth = .0015 if size < .2 else .004
    curve.bevel_resolution = 3
    o = bpy.data.objects.new(name, curve)
    bpy.context.collection.objects.link(o)
    o.location = p(loc)
    o.rotation_euler = (math.pi / 2, 0, 0) if rotation is None else rotation
    o.data.materials.append(material)
    o['om_section'] = 'lettering' if name.startswith('Fascia') else 'interior'
    return o


def area(name, loc, target, power, size, color='#ffdbac', shape='DISK', size_y=None):
    data = bpy.data.lights.new(name, 'AREA')
    data.energy = power
    data.color = rgba(color)[:3]
    data.shape = shape
    data.size = size
    if size_y is not None:
        data.size_y = size_y
    o = bpy.data.objects.new(name, data)
    bpy.context.collection.objects.link(o)
    o.location = p(loc)
    o.rotation_euler = (Vector(p(target)) - o.location).to_track_quat('-Z', 'Y').to_euler()
    return o


def vase(loc, size=1, index=0):
    # Lathed hollow ceramic profile: rounded shoulders, narrow lip, visible mouth.
    profile = [(0, 0), (.15, 0), (.18, .025), (.23, .14), (.225, .28),
               (.17, .4), (.09, .48), (.085, .54), (.068, .54), (.066, .49),
               (.145, .39), (.2, .28), (.2, .14), (.14, .04), (0, .04)]
    vertices, faces = [], []
    for r, y in profile:
        for i in range(40):
            a = i * math.tau / 40
            vertices.append((r * math.cos(a) * size, r * math.sin(a) * size, y * size))
    for j in range(len(profile) - 1):
        for i in range(40):
            a, b = j * 40 + i, j * 40 + (i + 1) % 40
            faces.append((a, b, b + 40, a + 40))
    mesh = bpy.data.meshes.new('Turned ceramic profile')
    mesh.from_pydata(vertices, [], faces)
    mesh.materials.append(ceramics[index % len(ceramics)])
    o = bpy.data.objects.new('Ceramic display vessel', mesh)
    bpy.context.collection.objects.link(o)
    o.location = p(loc)
    for face in mesh.polygons:
        face.use_smooth = True
    o['om_section'] = 'interior'
    return o


def framed_print(x, y, z, w=.44, h=.62, variant=0):
    box('Fine bronze print frame', (x, y + h/2, z), (w, h, .045), bronze, .004)
    box('Mounted cotton art paper', (x, y + h/2, z+.025), (w-.035, h-.035, .008), paper, .001)
    # Restrained printed geometric identity, deliberately separate from HTML UI.
    colors = [ink, ceramics[1], dark_wood]
    for i in range(3):
        o = box('Printed abstract composition', (x-.09+i*.085, y+h*.52, z+.031),
                (.058, h*(.2+i*.09), .001), colors[(variant+i)%3], 0)
        o.rotation_euler[1] = -.15 + i*.12
    label('Print identity', brief['brand'], (x, y+.075, z+.034), w*.047, ink, .0001)


# Shell, layered reveals, paved approach and individually jointed interior stone.
box('Concrete foundation', (0,-.27,-4), (15.6,.48,13), concrete, .025, 'shell')
box('Unfinished fascia substrate', (0,4.68,0), (14,2.05,.33), concrete, .015, 'shell')
for x in [-7, 7]:
    box('Side wall', (x,2.8,-5), (.24,5.6,10), plaster, .015, 'shell')
box('Rear wall', (0,2.8,-10), (14,5.6,.25), plaster, .015, 'shell')
box('Ceiling slab', (0,5.63,-5), (14,.18,10), plaster, .01, 'shell')
for x in range(14):
    for z in range(10):
        box('Honed stone floor tile', (x-6.5,-.015,-z-.5), (.997,.045,.997), stone, .003)
for step in range(3):
    box('Continuous stone entrance step', (0,-.07-step*.14,1.35+step*.57),
        (16+step*.4,.14,.58), paving, .015, 'exterior')
for x in range(24):
    for z in range(4):
        box('Exterior wet paving', (x-11.5,-.5,3.1+z*.6), (.995,.16,.595), paving, .004, 'exterior')
box('Street', (0,-.62,14), (120,.1,38), asphalt, .01, 'exterior')
for x in range(-45, 46, 6):
    box('Road lane marking', (x,-.565,11), (2,.003,.07), paper, 0, 'exterior')

# Fourteen cassette panels in two rows, a fine perimeter reveal, and lit lettering.
for i in range(8):
    for j in range(2):
        box('ACP cassette panel', (-6.125+i*1.75,4.21+j*.94,.24),
            (1.735,.926,.12), charcoal, .009, 'facade')
box('Upper bronze coping', (0,5.66,.24), (14.2,.065,.58), bronze, .012, 'facade')
box('Canopy fascia', (0,3.72,.29), (14.16,.12,.65), black, .012, 'facade')
box('Canopy fine bronze edge', (0,3.78,.64), (14.16,.022,.03), bronze, .004, 'facade')
for x in [-6.72, 6.72]:
    box('Deep clad pier', (x,1.8,.08), (.56,3.6,.53), charcoal, .01, 'facade')
    box('Bronze pier reveal', (x+.29,1.8,.32), (.012,3.59,.05), bronze, .002, 'facade')
label('Fascia bronze letter returns', brief['brand'], (0,4.48,.42), .82, bronze, .065)
label('Fascia illuminated faces', brief['brand'], (0,4.48,.56), .82, acrylic, .008)
label('Fascia secondary identity', brief['subline'], (0,4.13,.39), .13, bronze, .006)
area('Sign face reflected glow', (0,4.8,.72), (0,4.5,.2), 80, 7, '#ffe0ad', 'RECTANGLE', .4)
for x in [-5.4,-2.7,0,2.7,5.4]:
    box('Recessed entrance luminaire', (x,3.635,.31), (.13,.035,.13), black, .018)
    cylinder('Downlight glass lens', (x,3.61,.31), .05, .007, strip)
    area('Entrance pool of light', (x,3.59,.35), (x,0,.8), 85, .18)
for x in [-5.5,-1.8,1.8,5.5]:
    area('Facade grazing light', (x,5.68,.52), (x,4,.35), 60, .1)

# Slender black mullions, realistic glass thickness, bronze handles and film bands.
for x in [-6.35,-4,-1.65,1.65,4,6.35]:
    box('Window mullion', (x,1.8,.06), (.06,3.6,.12), black, .005)
for x in [-5.18,-2.82,2.82,5.18]:
    box('Clear glass pane', (x,1.8,.035), (2.28,3.52,.014), glass, .002)
    for y in [.07,3.54]:
        box('Glazing frame', (x,y,.06), (2.34,.065,.12), black, .005)
    for y in [1.12,1.22,1.32]:
        box('Window identity film stripe', (x,y,.046), (2.27,.043,.002), paper, 0)
for x in [-1.62,1.62]:
    box('Door handle mounting', (x,1.22,.22), (.032,.8,.04), bronze, .01)
label('Left window printed message', brief['windowLeft'], (-4,1.44,.06), .105, paper, .0005)
label('Right window printed message', brief['windowRight'], (4,1.44,.06), .105, paper, .0005)

# Rear feature wall: deep shadow grooves, warm vertical cladding and cove light.
box('PVC feature wall shadow backing', (4.45,2.7,-9.79), (4.65,5.3,.14), dark_wood)
for i in range(39):
    box('Oak finish PVC flute', (2.2+i*.119,2.65,-9.66), (.073,5.24,.14), wood, .012)
box('Feature wall concealed LED', (4.45,5.34,-9.43), (4.7,.035,.055), strip, .005)
area('Feature wall wash', (4.5,5.3,-9.35), (4.5,2,-9.7), 350, 4.5, '#ffd599', 'RECTANGLE', .25)
label('Rear wall lit customer identity', brief['brand'], (4.45,3.05,-9.5), .39, acrylic, .02)
label('Editorial interior statement', brief['interiorTitle'], (-2.85,3.8,-9.79), .72, ink, .015)
label('Editorial supporting statement', brief['interiorSubtitle'], (-2.85,3.44,-9.76), .13, ink, .002)
for x in [-6.85,6.85]:
    box('Bronze skirting', (x,.06,-5), (.022,.12,9.8), bronze, .003)
box('Rear skirting', (0,.065,-9.77), (13.7,.13,.022), bronze, .002)

# Gallery shelving across left and right walls, with stone storage and lit bays.
for x in [-6.57,6.57]:
    box('Built-in cabinet base', (x,.43,-5.3), (.61,.86,5.5), dark_wood, .025)
    for z in [-3.3,-4.65,-6,-7.3]:
        box('Cabinet door', (x+(.316 if x<0 else -.316),.42,z), (.016,.72,1.28), wood, .004)
        for y in [1.05,2.07,3.09]:
            box('Floating display shelf', (x,y,z), (.72,.043,1.32), wood, .006)
            box('Shelf warm LED channel', (x+(.17 if x<0 else -.17),y-.035,z), (.025,.018,1.18), strip, .003)
            vase((x,y+.03,z-.24), .68+(int(abs(z)*10)%3)*.12, int(abs(z)*10))
            for i in range(3):
                box('Displayed book', (x,y+.08+i*.041,z+.3), (.31,.039,.43),
                    [paper,ink,ceramics[1]][i], .003)
    area('Shelving bounce', (x+(1 if x<0 else -1),3.65,-5.3), (x,1,-5.3), 240, 3, '#ffe2b3')

# Freestanding displays, carefully finished consultation counter and print samples.
for i,(x,z) in enumerate([(-4.7,-4.8),(-2.8,-5.6)]):
    box('Stone display plinth', (x,.48,z), (1.1,.96,1.1), stone, .035)
    box('Plinth shadow base', (x,.045,z), (1.01,.09,1.01), black, .015)
    vase((x,.98,z), 1.12, i)
    cylinder('Small ceramic plate', (x+.3,.99,z+.25), .19, .025, ceramics[2])
box('Consultation counter shadow base', (-3.3,.05,-7.8), (3.28,.1,1.08), black, .025)
box('Consultation counter stone body', (-3.3,.61,-7.8), (3.4,1.13,1.15), dark_wood, .025)
for i in range(41):
    cylinder('Counter vertical rounded rib', (-4.92+i*.081, .6, -7.205), .027, 1.07, wood, vertices=12)
box('Veined stone counter top', (-3.3,1.195,-7.8), (3.53,.08,1.29), stone, .02)
label('Counter metal identity', brief['brand'], (-3.3,.62,-7.12), .2, bronze, .009)
for i in range(3):
    box('Printed collateral stack', (-4+i*.48,1.263,-7.54), (.35,.048,.43), paper, .002)
    label('Printed brochure identity', brief['brand'], (-4+i*.48,1.29,-7.48), .033, ink, .0001, rotation=(0,0,0))
    box('Printed brochure identity rule', (-4+i*.48,1.29,-7.62), (.21,.001,.009), ink, 0)
vase((-1.98,1.25,-7.95), .46, 3)

# Broad upholstered seating gives the interior scale and a lived-in retail context.
for x in [2.8,4.4]:
    box('Lounge chair upholstered seat', (x,.46,-8.35), (1.05,.22,.98), fabric, .1)
    box('Lounge chair back', (x,.89,-8.73), (1.05,.78,.2), fabric, .085)
    for side in [-.49,.49]:
        box('Lounge arm', (x+side,.65,-8.3), (.15,.36,.94), fabric, .065)
        for z in [-8.65,-8.05]:
            cylinder('Bronze chair foot', (x+side*.78,.2,z), .027, .4, bronze)
cylinder('Round side table top', (3.6,.53,-7.85), .36, .055, stone)
cylinder('Round side table pedestal', (3.6,.27,-7.85), .065, .49, bronze)
cylinder('Round side table base', (3.6,.035,-7.85), .24, .055, black)

# Entrance printing display: grounded stand, printed composition and crisp identity.
box('Freestanding print display frame', (3,1.3,-2), (1.3,2.6,.06), bronze, .008)
box('Freestanding flex print', (3,1.3,-1.963), (1.255,2.55,.008), paper, .001)
box('Print stand weighted base', (3,.025,-2), (1.45,.05,.56), black, .013)
label('Print headline top', brief['posterTop'], (3,2.08,-1.95), .14, ink, .0002)
label('Print headline middle', brief['posterMiddle'], (3,1.67,-1.95), .36, ink, .0002)
label('Print call to explore', brief['posterBottom'], (3,.35,-1.95), .085, ink, .0002)
for i in range(4):
    box('Graphic on printed display', (2.65+i*.235,.91,-1.952), (.14,.3+i*.14,.001),
        [ink,wood,ceramics[1],dark_wood][i], 0)
for i in range(3):
    framed_print(-4.7+i*1.22,1.1,-9.75,.85,1.15,i)
box('Window display island', (4.7,.48,-3.3), (2.25,.96,1.05), stone, .035)
box('Window display shadow base', (4.7,.035,-3.3), (2.1,.07,.91), black, .012)
for i in range(3):
    framed_print(4+i*.7,.98,-3.38,.46,.67,i)
for z in [-3.5,-6.2]:
    framed_print(-6.1,2.12,z,.34,.51,int(abs(z)))

# Ceiling fixtures, slots and real area light sources, rather than emissive bars alone.
for x in [-4.5,0,4.5]:
    box('Ceiling recessed track', (x,5.51,-5), (.11,.045,8.8), black, .007)
    box('Linear LED diffuser', (x,5.48,-5), (.045,.018,8.45), strip, .004)
    area('Long ceiling luminaire', (x,5.42,-5), (x,0,-5), 720, 7.5, '#ffe3ba', 'RECTANGLE', .3)
for x in [-5.8,-2,2,5.8]:
    for z in [-2.7,-5.6,-8.2]:
        cylinder('Ceiling recessed light trim', (x,5.48,z), .1, .025, black)
        cylinder('Ceiling light lens', (x,5.46,z), .072, .01, strip)
        area('Soft interior downlight', (x,5.4,z), (x,0,z), 95, .2)

# Detailed CC0 foliage with actual leaves, branching and photographed surfaces.
before = set(bpy.data.objects)
bpy.ops.import_scene.gltf(filepath=brief['plant'])
plant_objects = [o for o in bpy.data.objects if o not in before]
root = bpy.data.objects.new('Detailed planted tree', None)
bpy.context.collection.objects.link(root)
for obj in plant_objects:
    if obj.parent is None:
        obj.parent = root
    obj['om_section'] = 'foliage'
    # Preserve photographed bark and leaf materials. Replace only the vessel.
    if obj.name == 'potted_plant_01_pot':
        obj.hide_render = True
        obj.hide_viewport = True
bpy.context.view_layer.update()
points = [o.matrix_world @ Vector(corner) for o in plant_objects if o.type == 'MESH' for corner in o.bound_box]
lo = Vector(tuple(min(v[i] for v in points) for i in range(3)))
hi = Vector(tuple(max(v[i] for v in points) for i in range(3)))
plant_scale = 2.85 / (hi.z-lo.z)
root.scale = (plant_scale,)*3
root.location = p((-5.7,0,1.05))
root.location.z -= lo.z * plant_scale
box('Architectural tree planter', (-5.7,.45,1.05), (.73,.9,.73), planter, .012)
plant_positions = [((5.7,0,1.05),.8,1),((5.8,0,-8.9),2.1,1.1),
                   ((-9,-.4,3.2),1.5,1.4),((9,-.4,3.2),.2,1.4)]
plant_positions += [((-15-i*7.5,-.4,3.2), i*.78, 1.55) for i in range(4)]
for loc, rotation, scale in plant_positions:
    copy_root = bpy.data.objects.new('Planted tree instance', None)
    bpy.context.collection.objects.link(copy_root)
    copy_root.location = p(loc)
    copy_root.location.z -= lo.z * plant_scale * scale
    copy_root.scale = (plant_scale*scale,)*3
    copy_root.rotation_euler.z = rotation
    mapping = {root: copy_root}
    for obj in plant_objects:
        clone = obj.copy()
        bpy.context.collection.objects.link(clone)
        mapping[obj] = clone
    for obj in plant_objects:
        mapping[obj].parent = mapping.get(obj.parent, copy_root)
    box('Architectural tree planter', (loc[0],loc[1]+.45*scale,loc[2]),
        (.73*scale,.9*scale,.73*scale), planter, .012)
for x in [-5.7,5.7,-9,9]:
    area('Plant accent uplight', (x,.1,1.8 if abs(x)<8 else 3.8), (x,2.5,1), 55, .16, '#ffd596')

# Neighbor context repeats finer facade language and remains subdued at blue hour.
for side in [-1,1]:
    for i in range(4):
        x = side * (12.1 + i*7.3)
        box('Neighbor architectural volume', (x,3.9,-5.8), (6.3,7.8,11.2), dark_plaster, .035, 'context')
        for j in range(3):
            bx = x - 2 + j*2
            box('Neighbor glazed storefront', (bx,1.8,-.1), (1.82,3.55,.02), glass, .003, 'context')
            box('Neighbor recessed interior', (bx,1.8,-.65), (1.82,3.55,.1), dark_wood, .015, 'context')
            box('Neighbor window reveal', (bx,3.7,-.01), (1.9,.035,.11), bronze, .004, 'context')
            for y in [4.75,6.65]:
                box('Neighbor satin cladding panel', (bx,y,-.04), (1.98,1.87,.08), charcoal, .008, 'context')
                box('Neighbor recessed upper glazing', (bx,y,-.001), (1.3,.93,.015), glass, .002, 'context')
                box('Neighbor upper window interior', (bx,y,-.15), (1.33,.96,.015), black, .002, 'context')
        area('Neighbor soft light', (x,3.4,-.4), (x,.2,1), 120, 3, '#ffd49d', 'RECTANGLE', .4)

# Balance warm interior illumination with the blue-hour exposure; retain shadow depth.
for obj in bpy.data.objects:
    if obj.type == 'LIGHT' and any(term in obj.name for term in ['ceiling luminaire','interior downlight','Shelving bounce','wall wash']):
        obj.data.energy *= .38

# Camera and lighting. The HDR illuminates/refects the space; the camera sees dusk.
world = bpy.data.worlds.new('Blue hour environment')
world.use_nodes = True
scene.world = world
nodes, links = world.node_tree.nodes, world.node_tree.links
nodes.clear()
env = nodes.new('ShaderNodeTexEnvironment')
env.image = bpy.data.images.load(brief['environment'])
env_bg = nodes.new('ShaderNodeBackground')
env_bg.inputs['Strength'].default_value = .32
links.new(env.outputs[0], env_bg.inputs['Color'])
camera_bg = nodes.new('ShaderNodeBackground')
camera_bg.inputs['Color'].default_value = rgba('#243b61')
camera_bg.inputs['Strength'].default_value = .55
path = nodes.new('ShaderNodeLightPath')
mix = nodes.new('ShaderNodeMixShader')
links.new(path.outputs['Is Camera Ray'], mix.inputs[0])
links.new(env_bg.outputs[0], mix.inputs[1])
links.new(camera_bg.outputs[0], mix.inputs[2])
output = nodes.new('ShaderNodeOutputWorld')
links.new(mix.outputs[0], output.inputs[0])
area('Blue hour sky fill', (0,14,8), (0,0,0), 1200, 20, '#8eacdd')

camera_data = bpy.data.cameras.new('Continuous showroom camera')
camera = bpy.data.objects.new('Continuous showroom camera', camera_data)
bpy.context.collection.objects.link(camera)
scene.camera = camera
camera_data.lens = 36
camera_data.clip_start = .08
camera_data.clip_end = 250
initial_shot = brief['shots'][0]
camera.location = p(initial_shot['position'])
camera.rotation_euler = (Vector(p(initial_shot['target']))-camera.location).to_track_quat('-Z','Y').to_euler()
camera_data.lens = initial_shot.get('lens',36)
scene.render.engine = 'CYCLES'
scene.cycles.samples = 24 if args.preview else 96
scene.cycles.use_denoising = True
scene.cycles.max_bounces = 8
scene.cycles.transmission_bounces = 6
scene.cycles.transparent_max_bounces = 8
scene.render.resolution_x = 1200 if args.preview else 1800
scene.render.resolution_y = 750 if args.preview else 1125
scene.render.resolution_percentage = 100
scene.render.image_settings.file_format = 'PNG'
scene.view_settings.view_transform = 'AgX'
scene.view_settings.look = 'AgX - Medium High Contrast'
scene.view_settings.exposure = .15
try:
    prefs = bpy.context.preferences.addons['cycles'].preferences
    prefs.compute_device_type = 'METAL'
    prefs.get_devices()
    gpu = False
    for device in prefs.devices:
        device.use = device.type == 'METAL'
        gpu = gpu or device.use
    scene.cycles.device = 'GPU' if gpu else 'CPU'
    print('Render device:', scene.cycles.device, flush=True)
except Exception as error:
    print('Using CPU renderer:', str(error), flush=True)

shots = brief['shots'][:1] if args.preview and not args.all_shots else brief['shots']
if args.no_render:
    shots = []
for shot in shots:
    camera.location = p(shot['position'])
    camera.rotation_euler = (Vector(p(shot['target']))-camera.location).to_track_quat('-Z','Y').to_euler()
    camera_data.lens = shot.get('lens',36)
    bpy.context.view_layer.update()
    scene.render.filepath = str(out / (shot['name']+'.png'))
    bpy.ops.render.render(write_still=True)

# Store outlines, not the system font file, in the portable source scene.
bpy.ops.object.select_all(action='DESELECT')
for obj in list(bpy.data.objects):
    if obj.type == 'FONT':
        obj.select_set(True)
        bpy.context.view_layer.objects.active = obj
if bpy.context.selected_objects:
    bpy.ops.object.convert(target='MESH')
for curve in list(bpy.data.curves):
    if curve.users == 0:
        bpy.data.curves.remove(curve)
for unused_font in list(bpy.data.fonts):
    if unused_font.users == 0 and unused_font.filepath:
        bpy.data.fonts.remove(unused_font)
bpy.ops.file.pack_all()
bpy.ops.wm.save_as_mainfile(filepath=str(out / 'customer-showroom.blend'))
print('Architectural source and inspection renders saved to', out, flush=True)
