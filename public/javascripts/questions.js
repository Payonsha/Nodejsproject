$(document).ready(function(){
    console.log("js loaded");
    var socket = io.connect();
			var $questionForm = $('#send-question');
			var $questionBox = $('#question');
			var $questions = $('#questions');
	           
            var i = 1;
    
			$questionForm.submit(function(e){
				e.preventDefault();
                console.log("submitted from questionform");
                //send question to the server
				socket.emit('send question', {qst: $questionBox.val(), questionID: i});
				$questionBox.val('');
            });
			
    
    //receiving older questions from server
    socket.on('load old qsts', function(docsQuestions){
        console.log(docsQuestions);
        for(var i=0; i < docsQuestions.length; i++){
            displayMsg(docsQuestions[i]);
        }
    });
    
    
    // receiving new question from server
    socket.on('new question', function(data){
	   displayMsg(data);
                
       //$("#messages div").addClass("fadeInTop"); 
    });
    
    function displayMsg(data){
                $questions.prepend("<div id='question"+i+"'>" + data.qst + "<br /><form id='form"+i+"'><div class='form-group sp'><input type='text' class='form-control' id='reply"+i+"'></div><button type='submit' class='btn btn-default'>Beantwoord</button></form><div id='replies'></div></div>"); 
        
        var $questionid = '#question' + i;
                var $formsid = '#form' + i;
                var $repliesForm = $($formsid);
                var $replyBox = $('#reply' + i);
                
                $repliesForm.submit(function(e){
                    e.preventDefault();
                    console.log("submitted from form " + $formsid);
                    
                    //sending reply to the server
                    socket.emit('send reply', {reply: $replyBox.val(), questionid: $questionid, formid: $formsid});
                    $replyBox.val('');
                });
        
                i++;
    }
    
    
    
        // receiving new reply from server
        socket.on('new reply', function(data){
            //als de question id overeenkomt met de form id dan mag di da prependen aan de form met de id da overeenkomt met de question id
            console.log(data);
            console.log(data.reply);
            
            var replystartstring = data.reply.substring(0, 7);
            
            console.log(replystartstring);
            
            var questionid = data.questionid.substring(9, 10);
                    
            var formid = data.formid.substring(5, 10);
            
            
            if(questionid == formid){
                
                var question = data.questionid;
                console.log(question);
                console.log(question + ' #replies');
                
                if(replystartstring == "http://"){
                    var replyinimgtag = "<img src='"+data.reply+"' alt='an image' />";
                    $(question + ' #replies').append("<div class='areply'>" + replyinimgtag + "</div>");
                }else{
                    $(question + ' #replies').append("<div class='areply'>" + data.reply + "</div>");
                } 
            } 
            
                                          
        });
    
});
    

