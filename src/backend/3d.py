import nglview as nv
from Bio import PDB
import imageio
import os

# 假设你已经有了 PDB 数据和相应的 plddt 值
pdb_file="D:/code/neuropeptide/src/backend/high/G5EGH5_CAEELandFLP-8-1.pdb"

# 解析 PDB 文件
parser = PDB.PDBParser(QUIET=True)
structure = parser.get_structure("Protein", pdb_file)

# 为了简单起见，假设我们只对第一个链的每个残基应用 plddt 值
chain = structure[0]  # 获取第一个链
residues = list(chain.get_residues())

# 提取 B-factor 作为 plddt 值
plddt_values = []
for res in residues:
    # 提取残基的 B-factor（这里假设 B-factor 存在于 ATOM 记录行）
    b_factor = None
    for atom in res:
        if atom.get_bfactor():
            b_factor = atom.get_bfactor()
            break
    # 如果没有 B-factor 数据，可以使用默认值或忽略
    if b_factor is None:
        b_factor = 50  # 默认值，例如中等信度
    plddt_values.append(b_factor)

# 创建颜色映射
def plddt_to_color(plddt):
    if plddt >= 90:
        return [0.0, 1.0, 0.0]  # 高信度，绿色
    elif plddt >= 70:
        return [1.0, 1.0, 0.0]  # 中等信度，黄色
    else:
        return [1.0, 0.0, 0.0]  # 低信度，红色

# 检查 plddt_values 是否和残基数一致，如果不一致，则做处理
num_residues = len(residues)
if len(plddt_values) < num_residues:
    plddt_values = plddt_values * (num_residues // len(plddt_values)) + plddt_values[:(num_residues % len(plddt_values))]
elif len(plddt_values) > num_residues:
    plddt_values = plddt_values[:num_residues]

# 使用 NGLView 显示分子结构
view = nv.show_biopython(structure)

# 为每个残基设置不同颜色的 "stick" 表示
for i, res in enumerate(residues):
    color = plddt_to_color(plddt_values[i])
    # 为每个残基添加 stick 形式的表示并着色
    view.add_representation("stick", selection=f"resi {res.get_id()[1]}", color=color)

# 创建文件夹来保存每一帧图像
output_dir = "frames"
if not os.path.exists(output_dir):
    os.makedirs(output_dir)

# 旋转分子并保存不同的视角图像
frame_files = []
for i in range(60):  # 生成 60 帧
    view.camera.orbit(6, 6)  # 每次旋转一定角度
    frame_file = os.path.join(output_dir, f"frame_{i:03d}.png")
    view.render_image(width=400, height=400, factor=2)
    view._display_image().save(frame_file)  # 保存当前帧
    frame_files.append(frame_file)

# 使用 imageio 创建动图
gif_file = "protein_animation.gif"
with imageio.get_writer(gif_file, mode='I', duration=0.1) as writer:
    for frame_file in frame_files:
        image = imageio.imread(frame_file)
        writer.append_data(image)

# 清理中间帧文件
for frame_file in frame_files:
    os.remove(frame_file)

print(f"动画已保存为 {gif_file}")
