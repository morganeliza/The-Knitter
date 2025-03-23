// BackgroundVideo.jsx
import React from "react";

const BackgroundVideo = () => {
  return (
    <div className="video-container">
      <video autoPlay loop muted className="background-video">
        <source src="/https://drive.google.com/file/d/1esmJPRzlNl2fwqDOo3r7-NfvtWn-sgf6/view?usp=sharing/video.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
  );
};

export default BackgroundVideo;