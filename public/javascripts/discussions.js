$(document).ready(function(){
    console.log("js loaded");
    var socket = io.connect();
			var $discussionForm = $('#send-discussion');
			var $discussionBox = $('#discussion');
			var $messages = $('#messages');
	           
            var i = 1;
    
			$discussionForm.submit(function(e){
				e.preventDefault();
                console.log("submitted from discussionform");
                //send discussion to the server
				socket.emit('send discussion', {dsc: $discussionBox.val(), discussionID: i});
				$discussionBox.val('');
            });
			
    
    //receiving older discussions from server
    socket.on('load old dscs', function(docs){
        console.log(docs);
        for(var i=0; i < docs.length; i++){
            displayMsg(docs[i]);
        }
    });
    
    // receiving new discussion from server
    socket.on('new discussion', function(data){
	   displayMsg(data);
                
       //$("#messages div").addClass("fadeInTop"); 
    });
    
    function displayMsg(data){
                $messages.prepend("<div class='box' id='discussion"+i+"'><a href='/questions/" + data.discussionID + "'>" + data.dsc + "</a></div>"); 
                i++;    
            }
});
    

