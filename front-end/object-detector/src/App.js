import './App.css';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import Skeleton from '@mui/material/Skeleton';
import Typography from '@mui/material/Typography';
import { useRef, useState } from 'react';
import { uploadfile } from './services/ObjectDetectorService';

function App() {
  const fileInputRef = useRef(null);
  const [imageSrc, setImageSrc] = useState(null);
  const [detectionCompleted, setDetectionCompleted] = useState(false);
  const [firstUpload, setFirstUpload] = useState(true);

  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = async (event) => {
    setFirstUpload(false);  // Set the firstUpload variable to false
    setDetectionCompleted(false);  // Reset the detectionCompleted variable
    const file = event.target.files[0];
    // setImageSrc(URL.createObjectURL(file));
    
    const response = await uploadfile(file);  // Call the uploadfile function with the selected file
    console.log(response);  // Log the response from the server
    
    // display the image from response body
    const blob = await response.blob();
    
    const reader = new FileReader();
    reader.readAsDataURL(blob);
    reader.onloadend = () => {
      const base64String = reader.result;
      setImageSrc(base64String);
      setDetectionCompleted(true);  // Set the detectionCompleted variable to true
    };
  };

  return (
    <div className="App">
      <Box sx={{ height: '80vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        {
          detectionCompleted ? (
            <img src={imageSrc} height="100%"/>
          ) : (
            <Skeleton variant="rectangular" height={'100%'} width={'700px'} />
          )
        }
      </Box>
      <Box sx={{ height: '5vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        {
          firstUpload ? (
            <Typography sx={{marginLeft: '10px'}}>
              Please upload an image to start object detection.
            </Typography>            
          ): (
            detectionCompleted ? (
              <Typography sx={{marginLeft: '10px'}}>
                Detection completed
              </Typography>
            ) : (
              <Typography sx={{marginLeft: '10px'}}>
                Processing...
              </Typography>
            )
          )
        }
      </Box>
      <Box sx={{ height: '15vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Button variant="contained" size='large' sx={{margin: '10px'}} startIcon={<FileUploadIcon />} onClick={handleUploadClick}>
          Upload an image & start object detection
        </Button>
        <input type="file" id="fileInput" style={{ display: 'none' }} ref={fileInputRef} onChange={handleFileChange} />
      </Box>
    </div>
  );
}

export default App;