/**
 * References the html elements.
 */
const localVideoElement = document.getElementById("localVideo");
const remoteVideoElement = document.getElementById("remoteVideo");
const start = document.getElementById("start");
const call = document.getElementById("call");
const hangup = document.getElementById("hangup");

/**
 * Declares the local variables.
 */
let localStream;
let localPeerConnection, remotePeerConnection;

/**
 * Initial setup on page load.
 */
hangup.disabled = true;
call.disabled = true;

/**
 * startButtonClicked
 * Defines the onClick event for start button.
 * Gets the MediaStream from the MediaDevices Api and
 * feeds to the local video element.
 */
const startButtonClicked = () => {
  start.disabled = true;
  call.disabled = false;

  navigator.mediaDevices.getUserMedia({
    video: {
      width: 400,
      height: 300
    }
  }).then((stream) => {
    localVideoElement.srcObject = stream;
    localStream = stream;
  }).catch((error) => {
    alert("Could not get MediaStream");
  })
};

/**
 * callButtonClicked
 * Defines the onClick event for the call button.
 * Defines the local and remote RTCPeerConnection and
 * coordinates handshaking between the local and remote.
 */
const callButtonClicked = () => {
  start.disabled = true;
  call.disabled = true;
  hangup.disabled = false;

  const videoTracks = localStream.getVideoTracks();
  const audioTracks = localStream.getAudioTracks();

  if(videoTracks.length > 0) {
    console.log(`Using Video Device: ${videoTracks[0].label}`);
  }

  if(audioTracks.length > 0) {
    console.log(`Using Audion Device: ${audioTracksp[0].label}`);
  }

  let server = null;

  //Setting up local RTCPeerConnection.
  localPeerConnection = new RTCPeerConnection(server);

  localPeerConnection.onicecandidate = (event)  => {
    remotePeerConnection.addIceCandidate(event.candidate).then(() => {
      console.log("Local: Remote.addICE: Success");
    },(error) => {
      console.log(`Local: Remote.addICE: Failure: ${error}`);
    })
  };

  //Setting up remote RTCPeerConnection.
  remotePeerConnection = new RTCPeerConnection(server)

  remotePeerConnection.onicecandidate = (event) => {
    localPeerConnection.addIceCandidate(event.candidate).then(() => {
      console.log("Remote: Local.addICE: Suucess");
    }, (error) => {
      console.log(`Remote: Local.addICE: Failure`);
    })
  };


  localPeerConnection.oniceconnectionstatechange = (event) => {
    if (localPeerConnection) {
        console.log(localPeerConnection + "ICE State: " + localPeerConnection.iceConnectionState);
        console.log("ICE state change event: " + event);
    }
  };

  remotePeerConnection.oniceconnectionstatechange = (event) => {
    if (remotePeerConnection) {
      console.log(remotePeerConnection + "ICE State: " + remotePeerConnection.iceConnectionState);
      console.log("ICE state change event: " + event);
    }
  };

  remotePeerConnection.ontrack = (event) => {
    remoteVideoElement.srcObject = event.streams[0];
  };

  localStream.getVideoTracks().forEach( (track) => localPeerConnection.addTrack(track, localStream) );

  //Local RTCPeerConnection creates asynchronous offer.
  localPeerConnection.createOffer(
    {
      offerToReceiveAudio: 0,
      offerToReceiveVideo: 1
    }
  ).then((description) => {

    localPeerConnection.setLocalDescription(description).then(() => {
      console.log("Local: setLocationDescription Success on localPeerConnection");
    }).catch((error) => {
      console.log(`Local: setLocalDescription Failure on localPeerConnection ${error}`);
    })

    remotePeerConnection.setRemoteDescription(description).then(() => {
      console.log("Remote: setRemoteDescription Success on remotePeerConnection");
    }).catch((error) => {
      console.log(`Remote: setRemoteDescription Failure on remotePeerConnection: ${error}`);
    })

    //Remote RTCPeerConnection creates asynchronous answer.
    remotePeerConnection.createAnswer().then((description) => {

      console.log(`Answer from remotePeerConnection: ${description.sdp}`);
  
      console.log("Remote: remotePeerConnection.setLocalDescription Start.");
      remotePeerConnection.setLocalDescription(description).then(() => {
        console.log("Remote: remotePeerConnection.setLocalDescription Suucess.");
      }).catch((error) => {
        console.log(`Remote: remotePeerConnection.setLocalDescription Failure: ${error}`);
      })
  
      console.log("Local: localPeerConnection.setRemoteDescription Start.");
      localPeerConnection.setRemoteDescription(description).then(() => {
        console.log("Local: localPeerConnection.setRemoteDescription Success.");
      }).catch((error) => {
        console.log(`Local: localPeerConnection.setRemoteDescription Failure: ${error}`);
      })
    }).catch((error) => {
      console.log(`CreateAnswer: Error creating answer: ${error}`);
    })

  }).catch((error) => {
    console.log(`CreateOffer: Error creating offer: ${error}`);
  })
};

/**
 * hangupButtonClicked
 * Defines the onClick event for hangup button.
 * Resets the state for fresh start of RTCPeerConnection
 * and MediaStream consumption.
 */
const hangupButtonClicked = () => {
  if(localPeerConnection) {
    localPeerConnection.close();
    localPeerConnection = null;
  }
  if (remotePeerConnection) {
    remotePeerConnection.close();
    remotePeerConnection = null;
  }
  localVideoElement.srcObject = null;
  remoteVideoElement.srcObject = null;
  hangup.disabled = true;
  call.disabled = true;
  start.disabled = false;
};

/**
 * Defines the appropriate onClick events for buttons.
 */
start.onclick = startButtonClicked;
call.onclick = callButtonClicked;
hangup.onclick = hangupButtonClicked;
