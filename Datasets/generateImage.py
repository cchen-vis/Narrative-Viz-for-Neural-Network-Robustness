import json
import numpy as np
from PIL import Image
import os
import matplotlib.pyplot as plt

def pad(num, size):
  # Pad the number with zeros to the left until it reaches the desired size
    num_str = str(num)
    while len(num_str) < size:
        num_str = '0' + num_str
    return num_str


def read_json_and_save_images(json_file_path, output_folder):
    # Read the JSON file
    with open(json_file_path, 'r') as file:
        data = json.load(file)
    print(data.keys())
    # Ensure the output folder exists
    if not os.path.exists(output_folder):
        os.makedirs(output_folder)

    # Save each image locally with its index in the first two dimensions
    for i in range(6):
        images = np.array(data[str(i)])
        for j in range(512):
            image = images[j].transpose(1, 2, 0)  # Convert from (3, 32, 32) to (32, 32, 3)

            plt.figure()
            plt.imshow(image)
            plt.axis('off')

            save_path = os.path.join(output_folder, f'image_{i}_{pad(j,3)}.png')
            plt.savefig(save_path)
            plt.close()

            # print(f'Saved image {i}')

# Example usage
json_file_path = './Narrative-Viz-for-Neural-Network-Robustness/Datasets/sampleImages_NT.json'
output_folder = './Dataset/images_AT'
read_json_and_save_images(json_file_path, output_folder)