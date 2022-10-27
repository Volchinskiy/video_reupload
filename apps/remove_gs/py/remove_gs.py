from PIL import Image
import sys
import os

def execute():
  argv = sys.argv
  img_name = argv[1]
  input_path =  os.getenv('GS_INPUT_FOLDER')

  img = Image.open(input_path + img_name)
  img_data = img.load()
  height, width = img.size
  for i in range(height):
    for j in range(width):
      r, g, b, a = img_data[i, j]
      if  r < 120 and 255 >= g > 80 and b < 80: img_data[i, j] = 0, 0, 0, 0
      if  193 >= r >= 91 and 255 >= g >= 177 and 159 >= b >= 58: img_data[i, j] = 0, 0, 0, 0

  postfix = None
  new_img_name = None
  name_without_format = img_name.split(".")[0]
  output_path = os.getenv('GS_OUTPUT_FOLDER')
  if len(argv) == 3: postfix = argv[2]
  if postfix: new_img_name = name_without_format + "_" + postfix + ".png"
  else: new_img_name = name_without_format + ".png"

  img.save(output_path + new_img_name)

execute()
