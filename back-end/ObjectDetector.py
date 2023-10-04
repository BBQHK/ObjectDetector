import tensorflow as tf
import tensorflow_hub as hub
import numpy as np
from PIL import Image, ImageDraw
import os

def Detect(input_path, output_path):
    # Load the pre-trained model from the saved model directory
    model_url = './model/faster_rcnn_resnet50_v1_640x640_1'
    model = hub.load(model_url)

    # Load the image and preprocess it
    image = Image.open(input_path)
    image.thumbnail((640, 640))  # Resize the image to (640, 640)
    image_np = np.array(image) / 255.0
    image_tensor = tf.convert_to_tensor(image_np)
    image_tensor = tf.image.convert_image_dtype(image_tensor, tf.uint8)  # Convert the input tensor to tf.uint8
    image_tensor = tf.expand_dims(image_tensor, axis=0)

    # Check the shape and data type of the input tensor
    # print(tf.shape(image_tensor))
    # print(image_tensor.dtype)

    # Perform object detection
    output = model(image_tensor)
    boxes = output['detection_boxes'][0].numpy()
    classes = output['detection_classes'][0].numpy().astype(np.int32)
    scores = output['detection_scores'][0].numpy()

    # Load the label map from the file
    label_map_path = './model/mscoco_label_map.pbtxt'
    category_index = {}
    with open(label_map_path, 'r') as f:
        lines = f.readlines()
        for line in lines:
            if 'id:' in line:
                id = int(line.split(':')[-1])
            elif 'display_name:' in line:
                name = line.split(':')[-1].strip().replace("'", "")
                category_index[id] = {'id': id, 'name': name}

    # Draw the bounding boxes and class labels on the original image
    draw = ImageDraw.Draw(image)
    for i in range(len(boxes)):
        if scores[i] > 0.5:
            ymin, xmin, ymax, xmax = boxes[i]
            left = xmin * image.width
            top = ymin * image.height
            right = xmax * image.width
            bottom = ymax * image.height
            class_id = classes[i]
            class_name = category_index[class_id]['name']
            draw.rectangle(((left, top), (right, bottom)), outline='red')
            draw.text((left, top), f'class: {class_name}, score: {scores[i]:.2f}', fill='red')

    # Save the annotated image to an output file
    image.save(output_path)
    return 'OK'

if __name__ == '__main__':
    Detect('./uploads/test.jpg', './outputs/o.jpg')