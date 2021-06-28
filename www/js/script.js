

App.controller('home', function (page) {
  // put stuff here
  
  $(document).ready(function () {
    var rootUrl = 'http://marvsblog.medianewsonline.com/';
    /**
    * wordpress url to retrieve all posts from our blog
    */
    const url = `${rootUrl}/wp-json/wp/v2/posts`;
    /**
    * wordpress url used to retrieve a token for authentication
    */
    var tokenUrl = `${rootUrl}/wp-json/jwt-auth/v1/token`;
    /**
    * in this custom scenario, we will be creating posts via admin
    * access however in complex cases you should be able to register
    * new users, the admin username and password is needed to retrieve
    * a token which will be attached
    * as headers to subsequent requests for authentication
    */
    var adminDet = {
      username: 'PaulMarv',
      password: 'PaulMarv@1'
    };
    /**
    * variable to store token retrived from the api
    */
    var token;
    loadData();
    /**
    * ajax post request to retrieve the token once the app loads
    */
    $.post(tokenUrl, adminDet,
      function (data, status) {
        console.log("token: " + data.token);
        token = data.token;
      });
    /**
    * loadData() function makes a get request to retrieve
    * all posts from the wordpress blog
    */
    function loadData() {
      $.getJSON(url, function (data) {
        console.log(data);
        /**
 * removes the spinner once a response is gotten from the api
 */
        $("#spinner").remove();
        /**
        * ensures that the div tag with id= mainDiv
        * is empty before appending innerHtml to it
        */
        $("#mainDiv").empty();
        /**reiterates through each list in the json oblect
        * while appending it to the div tag with id= mainDiv
        */
        for (var i = 0; i < data.length; i++) {
          var div = document.createElement('div');
          var image= document.querySelector('#msg');
          div.innerHTML = `
                        <div class="card pt-1">
                        <div class="card-body">
                        <h4 class="card-title">${data[i].title.rendered}</h4>
                        <p class="card-text text-wrap">${data[i].content.rendered}</p>
                        <p><img src="" alt="" id="image" name='content'/></p>
                        `;
          $("#mainDiv").append(div);
        };
      });
    }
      
    /**
    * on form submission
    * submits the required parameters to create a new post in the
    * wordpress blog
    */
    $('form').submit(function (event) {
      // stop the form from submitting the normal way and refreshing the page
      event.preventDefault();
      // get the form data
      // there are many ways to get this data using jQuery (you can use the
      //  class or id also)
      var formData = {
        title: $('input[name=title]').val(),
        content:$('textarea[name=content]').val(),
        image: $('input[name=msg]').val(),
        status: 'publish'
        //<div><input type="text" name="msg" id="msg" style="display: none"></div>
        //contents:$('textarea[name=content]').val()
      };
      console.log(formData);
      $.ajax({
        url: url,
        method: 'POST',
        data: JSON.stringify(formData),
        crossDomain: true,
        contentType: 'application/json',
        headers: {
          'Authorization': 'Bearer ' + token
        },
        success: function (data) {
          console.log(data);
          /**
          * refreshes app-content to display latest posts
          */
          loadData();
        },
        error: function (error) {
          console.log(error);
        }
      });
    });
    document.getElementById("getPosition").addEventListener("click", getPosition);

    function getPosition() {
      var options = {
        enableHighAccuracy: true,
        maximumAge: 3600000
      }
      var watchID = navigator.geolocation.getCurrentPosition(onSuccess, onError, options);

      function onSuccess(position) {
        alert('Latitude: ' + position.coords.latitude + '\n' +
          'Longitude: ' + position.coords.longitude + '\n' +
          'Altitude: ' + position.coords.altitude + '\n' +
          'Accuracy: ' + position.coords.accuracy + '\n' +
          'Altitude Accuracy: ' + position.coords.altitudeAccuracy + '\n' +
          'Heading: ' + position.coords.heading + '\n' +
          'Speed: ' + position.coords.speed + '\n' +
          'Timestamp: ' + position.timestamp + '\n');
      };

      function onError(error) {
        alert('code: ' + error.code + '\n' + 'message: ' + error.message + '\n');
      }
    }



    var onDeviceReady= ()=>{
      document.querySelector("#btn").addEventListener("click", app.callCamera);
          console.log("button listener added");
          app.image = document.querySelector("#image");
      };

      
    var app = {
      image: null,
      imgOptions:null,
      
      callCamera: function ( ) {
        app.imgOptions = {quality : 75,
        destinationType: Camera.DestinationType.DATA_URL,
        sourceType: Camera.PictureSourceType.CAMERA,
        allowEdit : false,
        encodingType : Camera.EncodingType.JPEG,
        mediaType: Camera.MediaType.PICTURE,
        targetWidth : 300,
        targetHeight:400,
        cameraDirection : Camera.Direction.FRONT,
        saveToPhotoAlbum : false
         };
        
        navigator.camera.getPicture( app.imgSuccess, app.imgFail, app.imgOptions );
      },
        
      imgSuccess: function ( imageData ) {
        //got an image back from the camera
          app.image.src = "data:image/jpeg;base64," + imageData;
          document.querySelector("#msg").setAttribute('value',imageData);
          // document.querySelector('#msg').val() = imageData;
        console.log("Image loaded into interface");
        //clear memory in app
        navigator.camera.cleanup();
      },
        
      imgFail: function ( msg ) {
        console.log("Failed to get image: " +  msg);
      }
        
      };
      onDeviceReady();
  });
  
});

App.controller('page2', function (page) {
  // put stuff here
});

try {
  App.restore();
} catch (err) {
  App.load('home');
}