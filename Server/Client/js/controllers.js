/*
 * Angular 1.x.x
 * @author Sumit K
 */
var app = angular.module('mainApp.controller', ['btorfs.multiselect']);

/*
 * Common Controller
 */
app.controller('CommonCtrl', function ($scope, $location, $http) {
  console.log("CommonCtrl Controller reporting for duty.");
  
});

/*
 * Emp status Controller
 */
app.controller('StatusCtrl', function ($scope, $location, $http) {
  console.log("StatusCtrl Controller reporting for duty.");
  
});
/*
 * Home Controller
 */
app.controller('HomeCtrl', function ($scope, $location, $http ,BasicService,$filter,$ngBootbox,$route,$window){
  console.log("HomeCtrl Controller loaded..");
  
  $scope.modalObj ={};
  $scope.subTask = [];
  $scope.BuildObj = {};
  $scope.UsersInfo = [];
  $scope.maxDate = new Date().toDateString();
  $scope.locaStorageUserData = JSON.parse(localStorage.getItem("UserData"));
  $scope.userName = $scope.locaStorageUserData[0].FirstName+' '+$scope.locaStorageUserData[0].MiddleName+' '+$scope.locaStorageUserData[0].LastName;
  //alert(angular.toJson($scope.locaStorageUserData[0].ManagerId));
  $scope.UserIDJson = {"UserId":$scope.locaStorageUserData[0].UserID};
   var IsExistInDB = BasicService.IsUserExist({"globalID":$scope.locaStorageUserData[0].ManagerId});
                     IsExistInDB.then(function (data) {
                        if(data.status == "1"){
                            $scope.ManagerIDJson = {"UserId":data.response[0].UserID};
                            $scope.ManagersUserID = data.response[0].UserID;
                          }
                     });

  //$scope.ManagerIDJson = {"UserId":1021}; //Replaced with ManagersUserID

  var EmployeeBasicInfo = BasicService.getUserInfo($scope.UserIDJson);
      EmployeeBasicInfo.then(function (response) {
        $scope.UserEmployeeInfo =response;
          var ManagerBasicInfo = BasicService.getUserInfo($scope.ManagerIDJson);
          ManagerBasicInfo.then(function (response) {
            $scope.UserManagerInfo =response;
            if($scope.UserEmployeeInfo && $scope.UserManagerInfo){

                 if($scope.UserManagerInfo.length > 0 ){
                    $scope.UsersInfo = $scope.UserEmployeeInfo.concat($scope.UserManagerInfo);
                  }
                  else{
                    // Call JCI API, to get Managers's Info
                    $scope.UsersInfo = $scope.UserEmployeeInfo;
                  }
            }

          });

  }); 

  

  $scope.previousId = "";
  $scope.init = function(){


  };
  var JSONDATA = BasicService.getJSONDataFromTable({"UserId":$scope.locaStorageUserData[0].UserID});
                JSONDATA.then(function (data) {
                
          			$scope.jData = data;
                 $scope.bindHtml(2);
                 $scope.bindHtml(3);
                 $scope.bindHtml(4);
                 $scope.bindHtml(5);
                


        		});
  $scope.fetchTask = function(n,t){
    var IsMailSent = BasicService.IsMailSentStatus({"WeekId":n-1,"UserId":$scope.locaStorageUserData[0].UserID});
    IsMailSent.then(function (data) {
      //alert(angular.toJson(data));
      if(data.length > 0){
		  
        if(data[0].IsMailSent){
			$scope.IsMailSent = true;
			angular.element('#saveChanges').prop('disabled', true);
		    angular.element('#FinalSubmit').prop('disabled', true);
			angular.element('#popupsubmit').prop('disabled', true);
			angular.element('#addButton').prop('disabled', true);
		    angular.element('#TimeToComplete').prop('disabled', true);
		    angular.element('#dateCompleted').prop('disabled', true);
		    angular.element('#empDescription').prop('disabled', true);
        }else{
			$scope.IsMailSent = false;
			angular.element('#saveChanges').prop('disabled', false);
			//angular.element('#FinalSubmit').prop('disabled', false);
			angular.element('#popupsubmit').prop('disabled', false);
			angular.element('#addButton').prop('disabled', false);
		    angular.element('#TimeToComplete').prop('disabled', false);
		    angular.element('#dateCompleted').prop('disabled', false);
		    angular.element('#empDescription').prop('disabled', false);
		
        }
      }
	else{
		angular.element('#saveChanges').prop('disabled', false);
		angular.element('#popupsubmit').prop('disabled', false);
        angular.element('#addButton').prop('disabled', false);
		angular.element('#TimeToComplete').prop('disabled', false);
		angular.element('#dateCompleted').prop('disabled', false);
		angular.element('#empDescription').prop('disabled', false);
	}
    })

     $scope.taskNumber = t;
     $scope.modalObj.taskId = t;
     $scope.bindHtml(n);
     $scope.modalObj.taskId = t;
     $scope.loadSubTask(t-1);


  };              
  $scope.bindHtml = function (n){
	  //var myEl = angular.element( document.querySelector( '#popupsubmit' ) );
	  //myEl.prop('disabled', true);
    //myEl.addClass('disabled');
    $scope.weekIndex = n;
    if(n == 0){
      
        $scope.modalObj.Title =  "Welcome to Your role";
        $scope.modalObj.PageContent = $scope.jData.Welcome_Role;

        $scope.modalObj.E_Time = $scope.jData.Welcome_Role.Assignment.E_Time;
        $scope.modalObj.C_Tracking = $scope.jData.Welcome_Role.Assignment.TrackerName;
        $scope.modalObj.Date_Completion = $scope.jData.Welcome_Role.Assignment.date;
        $scope.modalObj.Notes = $scope.jData.Welcome_Role.Assignment.Desc;
        $scope.modalObj.Assignment = $scope.jData.Welcome_Role.Assignment;
        $scope.modalObj.assignStatus = $scope.jData.Welcome_Role.assignStatus;
    }
    if(n == 1){
        $scope.modalObj.Title =  "How to Use this Planner";
        $scope.modalObj.PageContent = $scope.jData.How_to_Use;
        $scope.modalObj.intro1 = $scope.jData.How_to_Use.intro1;
        $scope.modalObj.intro2 = $scope.jData.How_to_Use.intro2;
        $scope.modalObj.intro3 = $scope.jData.How_to_Use.intro3;
        $scope.modalObj.intro4 = $scope.jData.How_to_Use.intro4;
    }
  	else if(n == 2){
  			$scope.modalObj.Title =  "Week1";
  			$scope.modalObj.PageContent = $scope.jData.week_1;
  			$scope.modalObj.Assignment = $scope.jData.week_1.Assignment;
        $scope.BuildObj.Assignment = $scope.jData.week_1.Assignment;
  			$scope.modalObj.assignStatus = $scope.jData.week_1.assignStatus;
        $scope.BuildObj.assignStatus = $scope.jData.week_1.assignStatus;
        $scope.BuildObj.EmailFlag = $scope.jData.week_1.emailFlag;
        $scope.modalObj.EmailFlag = $scope.jData.week_1.emailFlag;
		$scope.modalObj.certificate = $scope.jData.week_1.certificates;
		
  	} else if(n == 3){
  			$scope.modalObj.Title =  "Week2";
  			$scope.modalObj.PageContent = $scope.jData.week_2;
  			$scope.modalObj.Assignment = $scope.jData.week_2.Assignment;
        $scope.BuildObj.Assignment = $scope.jData.week_2.Assignment;
  			$scope.modalObj.assignStatus = $scope.jData.week_2.assignStatus;
        $scope.BuildObj.assignStatus = $scope.jData.week_2.assignStatus;
        $scope. BuildObj.EmailFlag = $scope.jData.week_2.emailFlag;
        $scope.modalObj.EmailFlag = $scope.jData.week_2.emailFlag;
		$scope.modalObj.certificate = $scope.jData.week_2.certificates;
		
  	} else if(n == 4){
  			$scope.modalObj.Title =  "Week3";
  			$scope.modalObj.PageContent = $scope.jData.week_3;
  			$scope.modalObj.Assignment = $scope.jData.week_3.Assignment;
        $scope.BuildObj.Assignment = $scope.jData.week_3.Assignment;
  			$scope.modalObj.assignStatus = $scope.jData.week_3.assignStatus;
        $scope.BuildObj.assignStatus = $scope.jData.week_3.assignStatus;
        $scope.BuildObj.EmailFlag = $scope.jData.week_3.emailFlag;
        $scope.modalObj.EmailFlag = $scope.jData.week_3.emailFlag;
		$scope.modalObj.certificate = $scope.jData.week_3.certificates;
		
  	} else if(n == 5){
  			$scope.modalObj.Title =  "Week4";
  			$scope.modalObj.PageContent = $scope.jData.week_4;
  			$scope.modalObj.Assignment = $scope.jData.week_4.Assignment;
        $scope.BuildObj.Assignment = $scope.jData.week_4.Assignment;
  			$scope.modalObj.assignStatus = $scope.jData.week_4.assignStatus;
        $scope.BuildObj.assignStatus = $scope.jData.week_4.assignStatus;
        $scope.BuildObj.EmailFlag = $scope.jData.week_4.emailFlag;
        $scope.modalObj.EmailFlag = $scope.jData.week_4.emailFlag;
		$scope.modalObj.certificate = $scope.jData.week_4.certificates;
	}
 // if($scope.modalObj.taskId == undefined || $scope.modalObj.taskId == ""){
   // $scope.modalObj.taskId = 0;
    //alert("Initial");
  //}else{
   // alert("Otherwise");
  //}
    
    //$scope.loadSubTask($scope.modalObj.taskId);
    $scope.getProgressData();
    $scope.indicators($scope.modalObj.assignStatus,$scope.modalObj.EmailFlag);
	$scope.certificateStatus($scope.modalObj.certificate);
	
  }; 

  $scope.loadSubTask = function(id){
    //alert("Id"+id);
    if($scope.previousId != "" || $scope.previousId == 0){
      var previousSelected = angular.element('#subTask'+$scope.previousId);
      previousSelected.removeClass("selectionTask");
    }
    var subEl = angular.element('#subTask'+id);
    subEl.addClass("selectionTask");
    $scope.previousId = id;
    $scope.modalObj.taskId = id+1;
	  $scope.subTask = [];
	  var SubTaskCount = 0;
	  var selectedSubtask = 0;
    $scope.modalObj.selectionList =  [];
    //alert($scope.modalObj.taskId); 
  	$scope.filterSubTask = $filter('filter')($scope.modalObj.Assignment, { id: $scope.modalObj.taskId });
  	var subTaskObj = $scope.filterSubTask[0].subtask;
    //alert(angular.toJson($scope.filterSubTask));
  	var arr = [];
		angular.forEach(subTaskObj, function(value, key){
    		var b = {
    				"id" : key,
    				"name":value
    		}
    		arr.push(b);
			SubTaskCount++;
	});
    
	

        var mainTask =  parseInt($scope.modalObj.taskId)-1;
        var dd= {};
        dd = $scope.modalObj.assignStatus[mainTask];
        angular.forEach(dd, function(value, key){
        if(value == 1){
          $scope.modalObj.selectionList.push({"id":key,"name":value});
		      selectedSubtask++;
		  
        }
        
        });
	      $scope.subTask = arr;
		  console.log("Total Subask" + SubTaskCount);
		  console.log("Selected ITem" + selectedSubtask);
		  
      /*
       * Binding all data
       */
        $scope.modalObj.E_Time = $scope.filterSubTask[0].E_Time;
        $scope.modalObj.A_Time = $scope.filterSubTask[0].A_Time;
        $scope.modalObj.C_Tracking = $scope.filterSubTask[0].TrackerName;
        $scope.modalObj.Notes = $scope.filterSubTask[0].Desc;
        $scope.modalObj.Date_Completion = $scope.filterSubTask[0].date;
  			
  };
  /*
   * Sub Task
   */
   
  $scope.getProgressData = function(){
    var wTask = 100/$scope.modalObj.assignStatus.length;
    var percentage = 0;
 
    	for(var i=0;i<$scope.modalObj.assignStatus.length;i++){
        var wSubTask = wTask/Object.keys($scope.modalObj.assignStatus[i]).length;
        var subTask = $scope.modalObj.assignStatus[i];
        angular.forEach(subTask,function(value,key){
          if(value){
            percentage = percentage + wSubTask;
          }

        });
    	}
    $scope.taskCompletionPercent = Math.round(percentage);
    $scope.modalObj.myStyle = $scope.taskCompletionPercent+"%";
  };
  $scope.getUpdatedAssignment = function(){
   
   	  //var myE2 = angular.element( document.querySelector( '#popupsubmit' ) );
	    //myE2.prop('disabled', false);
      //myE2.removeClass('disabled');
    //Assignment Updation
    for(var i=0;i<$scope.modalObj.Assignment.length;i++){
      if($scope.modalObj.Assignment[i].id == $scope.modalObj.taskId){
          //$scope.modalObj.Assignment[i].subtask = $scope.modalObj.subtask;
          $scope.modalObj.Assignment[i].A_Time = $scope.modalObj.A_Time;
          $scope.modalObj.Assignment[i].date = $scope.modalObj.Date_Completion;
          $scope.modalObj.Assignment[i].Desc = $scope.modalObj.Notes;
      }

    }
    //Assignment Updation
     

      var index  = $scope.modalObj.taskId-1;
      var sampleArr = [];
       for(var k=0;k<$scope.modalObj.selectionList.length;k++){
        sampleArr.push($scope.modalObj.selectionList[k].id);
		if($scope.modalObj.selectionList.length == 4)
		  {
			 // alert("call");
		  }
       }

              angular.forEach($scope.modalObj.assignStatus[index], function(value, keys){
               
                 if(sampleArr.indexOf(keys) != -1){
                      $scope.modalObj.assignStatus[index][keys] = 1;
                  }                 
                  else{     
                      $scope.modalObj.assignStatus[index][keys] = 0;
                   }
              });


	  /* Updated JSON Build */
	  
	  var updatedAssignment =[];
    var certificate = [];
	  var finalResult = {};
	  for (var i = 0; i < $scope.modalObj.Assignment.length; i++) {
         updatedAssignment.push({ "id": $scope.modalObj.Assignment[i].id, 
										"name": $scope.modalObj.Assignment[i].name,
										"E_Time": $scope.modalObj.Assignment[i].E_Time,
										"A_Time": $scope.modalObj.Assignment[i].A_Time,
										"TrackerName": $scope.modalObj.Assignment[i].TrackerName,
										"date": $scope.modalObj.Assignment[i].date,
                                        "Desc": $scope.modalObj.Assignment[i].Desc,
                                        "subtask":$scope.modalObj.Assignment[i].subtask
										}); 
     }
	 
	  var updatedAssignStatus =$scope.modalObj.assignStatus;
    var certificate = $scope.modalObj.certificate;
    var emailFlag = 0;
	  var weeklyBuild = $scope.buildJSON(updatedAssignment,updatedAssignStatus,certificate,emailFlag);
    if(weeklyBuild){
      $scope.finalBuild(weeklyBuild);
    }
	  
	   
  };
    $scope.sendAnEmail = function(week,weekInt){
    var UserId = $scope.locaStorageUserData[0].UserID;
    var WeekId = weekInt;
    var CompletionDate = new Date();
    var IsMailSent = 'true';
    var IsApproved = 'false';
    var Status = 'Submitted';
    $scope.taskCompPara = {"UserId":UserId,"WeekId":WeekId,"CompletionDate":CompletionDate,"IsMailSent":IsMailSent,"IsApproved":IsApproved,"Status":Status}; 
    console.log(week);
                var mailOptions = {
                 
                  from: 'sumitkumardas.04@gmail.com', //Student's Email Id
                  to: 'sumitkumardas.04@gmail.com', //Manager's Email ID
                  subject: 'STEI Weekly Completion Report | '+ $scope.userName,
                  html:'<div>'
                          +'<h2>STEI Week Report</h2>'
                          +'<p>Hello,</p>'
                        +'<p>'+ $scope.userName + ' has completed '+week+' assignment</p>'
                        +'<p>Assignment Details:</p>'
                        +'<br />'
                        +'<table style="border: 1px solid #ddd; text-align: left; border-collapse: collapse; width: 100%;">'
    +'<thead>'
      +'<tr>'
      +'<th style="border: 1px solid #ddd; text-align: left; padding: 15px;">Sr.No</th>'
        +'<th style="border: 1px solid #ddd; text-align: left; padding: 15px;">Assignment</th>'
        +'<th style="border: 1px solid #ddd; text-align: left; padding: 15px;">Estimation Time</th>'
        +'<th style="border: 1px solid #ddd; text-align: left; padding: 15px;">Actual Time</th>'
    +'<th style="border: 1px solid #ddd; text-align: left; padding: 15px;">Completion Tracking</th>'
    +'<th style="border: 1px solid #ddd; text-align: left; padding: 15px;">Date</th>'
    +'<th style="border: 1px solid #ddd; text-align: left; padding: 15px;">Comment</th>'
      +'</tr>'
    +'</thead>'
    +'<tbody>'
      +'<tr>'
        +'<td style="border: 1px solid #ddd; text-align: left; padding: 15px;">1</td>'
    +'<td style="border: 1px solid #ddd; text-align: left; padding: 15px;">Fisrt Assignemnt</td>'
        +'<td style="border: 1px solid #ddd; text-align: left; padding: 15px;">2.5</td>'
    +'<td style="border: 1px solid #ddd; text-align: left; padding: 15px;">3</td>'
    +'<td style="border: 1px solid #ddd; text-align: left; padding: 15px;">Manager</td>'
    +'<th style="border: 1px solid #ddd; text-align: left; padding: 15px;">18-12-2017</th>'
    +'<th style="border: 1px solid #ddd; text-align: left; padding: 15px;">Comment Here</th>'
      +'</tr>'
    +'</tbody>'
  +'</table>',
  data:$scope.taskCompPara
               
              };

          var sentMail = BasicService.sendMail(mailOptions); 
          sentMail.then(function (data) {
              if(data.status == "1"){
                console.log("Mail Sent Succfully");
                $scope.mailTo = 'mailto:'+mailOptions.from+'?Subject='+mailOptions.subject;
                $window.open('mailto:'+mailOptions.from+'?Subject='+mailOptions.subject,'_blank');
                angular.element('#myModal').modal('hide');
                //$route.reload();
              }else if(data.status == "0"){
                console.log("Somthing is wrong in web server")
              }else{
                console.log("API is Not calling");
              }
          });
              


  };
$scope.mailToConfirmationOnSubmit = function(title,weekIndex){
  angular.element('#myModal').modal('hide');
  var options = {
        scope: $scope,
        message: "",
        title: "Submit & Email to Manager for "+title ,
        className: 'test-class',
        templateUrl: 'templates/WeeklySubmit.html',
        buttons: {
             warning: {
                 label: "Cancel",
                 className: "btn-warning btn-sm",
                 callback: function() {  
                    // Do Somthing
                 }
             },
             success: {
                 label: "Email & Submit",
                 className: "btn-success btn-sm",
                 callback: function() {  
                  
                  $scope.sendAnEmail(title,weekIndex);
                  // Do Somthing
                 }
            }
        }
  }
$ngBootbox.customDialog(options);
};
  $scope.certificateStatus = function(certificateDetails)
  {
	  for (var i = 0; i < certificateDetails.length; i++) {
		  //console.log("total node" + i);
	  }
  }
   $scope.indicators = function(statusDetails,emailStatus)
  {
	var week = $scope.weekIndex;
	//Checking week
    if(week == 2){
      var weektaskCompleted =0;
	  var weeksubtask =0;
	  for (var i = 0; i < statusDetails.length; i++) {
		  var cnt= 0;
		  var allnode=0;
	  angular.forEach(statusDetails[i], function(value, keys){
                  allnode++;
					if (value == 1) {
						cnt++;
						}
				});
				if(allnode == cnt)
				{   
                    weektaskCompleted++;
					var key = 'w'+ week + "_" + "a"+ (i+1);
					$scope.modalObj[key] =true;
          angular.element('#w'+ week + "_t_" + (i+1) +" " + "a").removeClass('yellow_circle');
          angular.element('#w'+ week + "_t_" + (i+1) +" " + "a").removeClass('white_circle');
          angular.element('#w'+ week + "_t_" + (i+1) +" " + "a").removeClass('status_black');
          angular.element('#w'+ week + "_t_" + (i+1) +" " + "a").removeClass('status_yellow');
          angular.element('#w'+ week + "_t_" + (i+1) +" " + "a").addClass('green_circle');	
				}
		    else if(cnt >0 && cnt < allnode)
				{
          var key = 'w'+ week + "_" + "a"+ (i+1);
          $scope.modalObj[key] =false;
					console.log('cnt' +'w'+ week + "_" + "a"+ (i+1));
					//var progress = 'w'+ week + "_t_" + (i+1);
					angular.element('#w'+ week + "_t_" + (i+1) +" " + "a").removeClass('white_circle');
					angular.element('#w'+ week + "_t_" + (i+1) +" " + "a").removeClass('status_black ');
					angular.element('#w'+ week + "_t_" + (i+1) +" " + "a").addClass('yellow_circle');
					weeksubtask++;
				}else if(cnt == 0){
          var key = 'w'+ week + "_" + "a"+ (i+1);
          $scope.modalObj[key] =false;
          angular.element('#w'+ week + "_t_" + (i+1) +" " + "a").removeClass('yellow_circle');
          angular.element('#w'+ week + "_t_" + (i+1) +" " + "a").removeClass('green_circle');
          angular.element('#w'+ week + "_t_" + (i+1) +" " + "a").removeClass('status_black');
          angular.element('#w'+ week + "_t_" + (i+1) +" " + "a").removeClass('status_yellow');
          angular.element('#w'+ week + "_t_" + (i+1) +" " + "a").addClass('white_circle');
        }

	  }
  	  if(weektaskCompleted == 8)
  	  {   
          $scope.fisrtweek =true;
          $scope.modalObj.week1Status = "Completed";
          $scope.modalObj.week1StatusClass="btn-success";
  		    angular.element('.week_01_icon img').attr('src', 'images/green_week1.png');
			angular.element('#saveChanges').prop('disabled', true);
      		var a=angular.element('.week_02_icon img');
      		if(a.attr('src')== 'images/green_week2.png')
      		 {
      		  angular.element('.week_02_icon img').attr('src', 'images/green_week2.png');
      		   //angular.element('.week_02_icon img').css('cursor', 'not-allowed');
      		 }
      		 else
      		 {
      		   angular.element('.week_02_icon img').attr('src', 'images/week_02_visited.png');
      		 }
      		angular.element('.week_02_icon').attr('data-target', '#myModal');
              angular.element('.week_02_icon').css('cursor', 'pointer');
		         angular.element('.w2').attr('data-target', '#myModal');
              angular.element('.w2').css('cursor', 'pointer');
			  allowPopup();
			  
      		/* Disabled click on completed week1 */
      		  //angular.element('.week_01_icon').attr('data-target', '');
             // angular.element('.week_01_icon').css('cursor', 'not-allowed');
             //alert("Call");
              if(emailStatus == 0){
                 angular.element('#FinalSubmit').prop('disabled', false);
              }
  	  }else{
		  $scope.fisrtweek =false;
        if(weektaskCompleted > 0 || weeksubtask > 0){
          $scope.modalObj.week1Status = "In Progress";
          $scope.modalObj.week1StatusClass="btn-warning";
        }
		else{
          $scope.modalObj.week1Status = "Not Started";
          $scope.modalObj.week1StatusClass="btn-danger";
        }
        angular.element('.week_02_icon').attr('data-target', '');
        angular.element('.week_02_icon').css('cursor', 'not-allowed');
		  angular.element('.w2').attr('data-target', '');
        angular.element('.w2').css('cursor', 'not-allowed');
		allowPopup();

      }
    }else if(week ==3){
	   var weektaskCompleted =0;
	  var weeksubtask =0;
       for (var i = 0; i < statusDetails.length; i++) {
      var cnt= 0;
      var allnode=0;
    angular.forEach(statusDetails[i], function(value, keys){
                  allnode++;
          if (value == 1) {
            cnt++;
          }
        });
        if(allnode == cnt)
        {
          weektaskCompleted++;
          var key = 'w'+ week + "_" + "a"+ (i+1);
          $scope.modalObj[key] =true; 
          angular.element('#w'+ week + "_t_" + (i+1) +" " + "a").removeClass('yellow_circle');
          angular.element('#w'+ week + "_t_" + (i+1) +" " + "a").removeClass('white_circle');
          angular.element('#w'+ week + "_t_" + (i+1) +" " + "a").removeClass('status_black');
          angular.element('#w'+ week + "_t_" + (i+1) +" " + "a").removeClass('status_yellow');
          angular.element('#w'+ week + "_t_" + (i+1) +" " + "a").addClass('green_circle');
        } 
		    else if(cnt >0 && cnt < allnode)
		    {
          var key = 'w'+ week + "_" + "a"+ (i+1);
          $scope.modalObj[key] =false; 
    			
    			angular.element('#w'+ week + "_t_" + (i+1) +" " + "a").removeClass('white_circle');
    			angular.element('#w'+ week + "_t_" + (i+1) +" " + "a").addClass('yellow_circle');
    			angular.element('#w'+ week + "_t_" + (i+1) +" " + "a").removeClass('status_black');
    			angular.element('#w'+ week + "_t_" + (i+1) +" " + "a").addClass('status_yellow');
				weeksubtask++;
	      }else if(cnt == 0){
          var key = 'w'+ week + "_" + "a"+ (i+1);
          $scope.modalObj[key] =false;
          angular.element('#w'+ week + "_t_" + (i+1) +" " + "a").removeClass('yellow_circle');
          angular.element('#w'+ week + "_t_" + (i+1) +" " + "a").removeClass('green_circle');
          angular.element('#w'+ week + "_t_" + (i+1) +" " + "a").removeClass('status_black');
          angular.element('#w'+ week + "_t_" + (i+1) +" " + "a").removeClass('status_yellow');
          angular.element('#w'+ week + "_t_" + (i+1) +" " + "a").addClass('white_circle');
        }		
    }
    if(weektaskCompleted == 5)
    {
	  $scope.secondweek =true;
      $scope.modalObj.week2Status = "Completed";
      $scope.modalObj.week2StatusClass="btn-success";
      angular.element('.week_02_icon img').attr('src', 'images/green_week2.png');
	  var a=angular.element('.week_03_icon img');
		if(a.attr('src')== 'images/green_week3.png')
		 {
		  angular.element('.week_03_icon img').attr('src', 'images/green_week3.png');
		   //angular.element('.week_03_icon img').css('cursor', 'not-allowed');
		 }
		 else
		 {
		   angular.element('.week_03_icon img').attr('src', 'images/week_03_visited.png');
		 }
      
      angular.element('.week_03_icon').attr('data-target', '#myModal');
      angular.element('.week_03_icon').css('cursor', 'pointer');
	  angular.element('.w3').attr('data-target', '#myModal');
      angular.element('.w3').css('cursor', 'pointer'); 
	  allowPopup();
	  /* Disabled click on completed week2 */
		//angular.element('.week_02_icon').attr('data-target', '');
       // angular.element('.week_02_icon').css('cursor', 'not-allowed');
      if(emailStatus == 0){
          //Send Email
          angular.element('#FinalSubmit').prop('disabled', false);
        }
    }else{
		$scope.secondweek =false;
      if(weektaskCompleted > 0 || weeksubtask > 0 )  {
          $scope.modalObj.week2Status = "In Progress";
          $scope.modalObj.week2StatusClass="btn-warning";
        }
		 else{
          $scope.modalObj.week2Status = "Not Started";
          $scope.modalObj.week2StatusClass="btn-danger";
        } 
        angular.element('.week_03_icon').attr('data-target', '');
        angular.element('.week_03_icon').css('cursor', 'not-allowed');
		 angular.element('.w3').attr('data-target', '');
        angular.element('.w3').css('cursor', 'not-allowed'); 
        angular.element('#FinalSubmit').prop('disabled', true);
		allowPopup();
    }
	  
    }else if(week == 4){
      var weektaskCompleted =0;
	  var weeksubtask =0;
       for (var i = 0; i < statusDetails.length; i++) {
      var cnt= 0;
      var allnode=0;
    angular.forEach(statusDetails[i], function(value, keys){
                  allnode++;
          if (value == 1) {
            cnt++;
		}
        });
        if(allnode == cnt)
        {
          weektaskCompleted++
          var key = 'w'+ week + "_" + "a"+ (i+1);
          $scope.modalObj[key] =true; 
          angular.element('#w'+ week + "_t_" + (i+1) +" " + "a").removeClass('yellow_circle');
          angular.element('#w'+ week + "_t_" + (i+1) +" " + "a").removeClass('white_circle');
          angular.element('#w'+ week + "_t_" + (i+1) +" " + "a").removeClass('status_black');
          angular.element('#w'+ week + "_t_" + (i+1) +" " + "a").removeClass('status_yellow');
          angular.element('#w'+ week + "_t_" + (i+1) +" " + "a").addClass('green_circle');
        }
		else if(cnt >0 && cnt<allnode)
		{
      var key = 'w'+ week + "_" + "a"+ (i+1);
      $scope.modalObj[key] =false;
			console.log('cnt' +'w'+ week + "_" + "a"+ (i+1));
			angular.element('#w'+ week + "_t_" + (i+1) +" " + "a").removeClass('white_circle');
			angular.element('#w'+ week + "_t_" + (i+1) +" " + "a").addClass('yellow_circle');
			
			angular.element('#w'+ week + "_t_" + (i+1) +" " + "a").removeClass('status_black');
			angular.element('#w'+ week + "_t_" + (i+1) +" " + "a").addClass('status_yellow');
			weeksubtask++;
	  }
    else if(cnt == 0){
          var key = 'w'+ week + "_" + "a"+ (i+1);
          $scope.modalObj[key] =false;
          angular.element('#w'+ week + "_t_" + (i+1) +" " + "a").removeClass('yellow_circle');
          angular.element('#w'+ week + "_t_" + (i+1) +" " + "a").removeClass('green_circle');
          angular.element('#w'+ week + "_t_" + (i+1) +" " + "a").removeClass('status_black');
          angular.element('#w'+ week + "_t_" + (i+1) +" " + "a").removeClass('status_yellow');
          angular.element('#w'+ week + "_t_" + (i+1) +" " + "a").addClass('white_circle');
    }
    }
      if(weektaskCompleted == 11)
      {
		  $scope.thirdweek =true;
        $scope.modalObj.week3Status = "Completed";
        $scope.modalObj.week3StatusClass="btn-success";
        angular.element('.week_03_icon img').attr('src', 'images/green_week3.png');
		var a=angular.element('.week_04_icon img');
		if(a.attr('src')== 'images/green_week4.png')
		 {
		  angular.element('.week_04_icon img').attr('src', 'images/green_week4.png');
		   //angular.element('.week_04_icon img').css('cursor', 'not-allowed');
		 }
		 else
		 {
		   angular.element('.week_04_icon img').attr('src', 'images/week_04_visited.png');
		 }
        angular.element('.week_04_icon').attr('data-target', '#myModal');
        angular.element('.week_04_icon').css('cursor', 'pointer');
		  angular.element('.w4').attr('data-target', '#myModal');
        angular.element('.w4').css('cursor', 'pointer');
		allowPopup();
		/* Disabled click on completed week3 */
		//angular.element('.week_03_icon').attr('data-target', '');
        //angular.element('.week_03_icon').css('cursor', 'not-allowed');
        if(emailStatus == 0){
          //Send Email
          angular.element('#FinalSubmit').prop('disabled', false);
          
        }
      }else{
		  $scope.thirdweek =false;
        if(weektaskCompleted > 0 || weeksubtask > 0){
          $scope.modalObj.week3Status = "In Progress";
          $scope.modalObj.week3StatusClass="btn-warning";
        }else{
          $scope.modalObj.week3Status = "Not Started";
          $scope.modalObj.week3StatusClass="btn-danger";
        }
        angular.element('.week_04_icon').attr('data-target', '');
        angular.element('.week_04_icon').css('cursor', 'not-allowed');
		  angular.element('.w4').attr('data-target', '');
        angular.element('.w4').css('cursor', 'not-allowed');
        angular.element('#FinalSubmit').prop('disabled', true);
		allowPopup();
      }
	  
    }else if(week == 5){
      var weektaskCompleted =0;
	  var weeksubtask =0;
       for (var i = 0; i < statusDetails.length; i++) {
      var cnt= 0;
      var allnode=0;
    angular.forEach(statusDetails[i], function(value, keys){
                  allnode++;
          if (value == 1) {
            cnt++;
          }
        });
        if(allnode == cnt)
        {
          weektaskCompleted++;
          var key = 'w'+ week + "_" + "a"+ (i+1);
          $scope.modalObj[key] =true; 
          angular.element('#w'+ week + "_t_" + (i+1) +" " + "a").removeClass('yellow_circle');
          angular.element('#w'+ week + "_t_" + (i+1) +" " + "a").removeClass('white_circle');
          angular.element('#w'+ week + "_t_" + (i+1) +" " + "a").removeClass('status_black');
          angular.element('#w'+ week + "_t_" + (i+1) +" " + "a").removeClass('status_yellow');
          angular.element('#w'+ week + "_t_" + (i+1) +" " + "a").addClass('green_circle');
        } 
		    else if(cnt >0 && cnt<allnode)
				{
          var key = 'w'+ week + "_" + "a"+ (i+1);
          $scope.modalObj[key] =false;
					console.log('cnt' +'w'+ week + "_" + "a"+ (i+1));
					angular.element('#w'+ week + "_t_" + (i+1) +" " + "a").removeClass('white_circle');
					angular.element('#w'+ week + "_t_" + (i+1) +" " + "a").addClass('yellow_circle');
					angular.element('#w'+ week + "_t_" + (i+1) +" " + "a").removeClass('status_black');
			       angular.element('#w'+ week + "_t_" + (i+1) +" " + "a").addClass('status_yellow');
				weeksubtask++;
				}	
        else if(cnt == 0){
          var key = 'w'+ week + "_" + "a"+ (i+1);
          $scope.modalObj[key] =false;
          angular.element('#w'+ week + "_t_" + (i+1) +" " + "a").removeClass('yellow_circle');
          angular.element('#w'+ week + "_t_" + (i+1) +" " + "a").removeClass('green_circle');
          angular.element('#w'+ week + "_t_" + (i+1) +" " + "a").removeClass('status_black');
          angular.element('#w'+ week + "_t_" + (i+1) +" " + "a").removeClass('status_yellow');
          angular.element('#w'+ week + "_t_" + (i+1) +" " + "a").addClass('white_circle');
    }	
    }
      if(weektaskCompleted == 6) 
      {
		  $scope.fourweek =true;
        $scope.modalObj.week4Status = "Completed";
        $scope.modalObj.week4StatusClass="btn-success"
        angular.element('.week_04_icon img').attr('src', 'images/green_week4.png');
		allowPopup();
		/* Disabled click on completed week4 */
		//angular.element('.week_04_icon').attr('data-target', '');
        //angular.element('.week_04_icon').css('cursor', 'not-allowed');
        if(emailStatus == 0){
          //Send Email
          //$scope.sendAnEmail("Week4",4);
        }
      }else{
		  $scope.fourweek =false;
        if(weektaskCompleted > 0 || weeksubtask > 0){
          $scope.modalObj.week4Status = "In Progress";
          $scope.modalObj.week4StatusClass="btn-warning"
        }else{
          $scope.modalObj.week4Status = "Not Started";
          $scope.modalObj.week4StatusClass="btn-danger"
        }
		allowPopup();
      }
	  
    }
	function allowPopup()
	{
		if($scope.fisrtweek == true)
		{
	     angular.element('.w1').attr('data-target', '#myModal');
         angular.element('.w1').css('cursor', 'pointer');
		}
		if($scope.secondweek == true)
		{
	     angular.element('.w2').attr('data-target', '#myModal');
         angular.element('.w2').css('cursor', 'pointer');
		}
		if($scope.thirdweek == true)
		{
	     angular.element('.w3').attr('data-target', '#myModal');
         angular.element('.w3').css('cursor', 'pointer');
		}
		if($scope.fourweek == true)
		{
	     angular.element('.w4').attr('data-target', '#myModal');
         angular.element('.w4').css('cursor', 'pointer');
		}
		
	}
	
  }

  $scope.buildJSON = function(assignment,assignStatus,certificate,emailFlag){
        var build = {
          "Assignment": assignment,
          "assignStatus": assignStatus,
          "certificates":certificate,
          "emailFlag":emailFlag
        }
        return build;
  };

  $scope.saveDetails = function(){
    /*
     * Save Updated TaskJson in TaskSheet Table
     */
    $scope.getUpdatedAssignment();
	  var updated = BasicService.saveDetails({"UserId":$scope.locaStorageUserData[0].UserID,"TaskJSON":$scope.LastOne.data});
    updated.then ( function (response) {
      /*
      * Save Updated Employee's Comments in UserComments Table
      */
      if(response.status == 1) {
      var IsTaskApproved = null;
      var WeekId = $scope.weekIndex-1;
      var TaskId = $scope.taskNumber;
      var UserId = $scope.locaStorageUserData[0].UserID;
      var CommentedDate = new Date();
      var CommentedFor = $scope.ManagersUserID;
      var CommentedText =  $scope.modalObj.Notes;
      var Status = "Active";  
      // If Employees Comment Section is Empty then don't save it in UserComment Table
      if($scope.modalObj.Notes != ""){

        $scope.savCommentPara = {"UserId":UserId,"WeekId":WeekId,"TaskId":TaskId,"IsTaskApproved" : IsTaskApproved,"ComentedDate" : CommentedDate,"CommentedFor":CommentedFor,"CommentedText" : CommentedText ,"Status": Status};
        var commentSaveCall = BasicService.SaveUserComents($scope.savCommentPara);
        commentSaveCall.then(function (response) { 
              console.log("Response"+response);
              if(response.status == 1){
                 console.log(response.message);   
              }
        });

      }
                  /*
                   * Checking If this Task is Rejected then Update ( SET IsTaskCompleted Null ) in UserComments Table
                   */
                   $scope.updateCommentPara = {"WeekId":WeekId ,"TaskId":TaskId,"UserId":UserId};
                    var updateComment = BasicService.IfRejectionThenSet($scope.updateCommentPara);
                    updateComment.then(function (response) {
                      if(response.status == 1){
                        $ngBootbox.alert({
                          message: "Task has been saved successfully.",
                          size: 'small'
                        });
                        console.log(response.message);
                      }else{
                        console.log(response.message);
                        $ngBootbox.alert({
                          message: "Somthing went wrong.",
                          size: 'small'
                        });
                      }
                      // Close Modal
                      angular.element('#myModal').modal('hide');
                      // Call Indicator Function to update the green/yellow/white indicators according to recent saved TaskJson
                      $scope.indicators($scope.modalObj.assignStatus,$scope.modalObj.EmailFlag);
                    });

      }else{
        $ngBootbox.alert({
                          message: "Somthing went wrong",
                          size: 'small'
                        });
      } // If Else Closed
    });
		
  };

    $scope.menuClick = function()
	{
	  if(angular.element('.slideupMenu').css('display')== 'none')
		{
		angular.element('.slideupMenu').css('display', 'block');
		}
		else{
		   angular.element('.slideupMenu').css('display', 'none');
		}
	};
	
   $scope.Logout = function()
   {
	   localStorage.clear();
	   $location.path('/');
   }	   
  $scope.finalBuild = function(weeklyBuild){
    var weekIndex = $scope.weekIndex;
    if(weekIndex == 2){
      $scope.jData.week_1 = {};
      $scope.jData.week_1 = weeklyBuild
      $scope.LastOne = {
                "fileName":localStorage.getItem("userName"),
                "data":$scope.jData
      };
    }else if(weekIndex ==3){
      $scope.jData.week_2 = {};
      $scope.jData.week_2 = weeklyBuild
      $scope.LastOne = {
                "fileName":localStorage.getItem("userName"),
                "data":$scope.jData
      };
    }else if(weekIndex == 4){
      $scope.jData.week_3 = {};
      $scope.jData.week_3 = weeklyBuild
      $scope.LastOne = {
                "fileName":localStorage.getItem("userName"),
                "data":$scope.jData
      };
    }else if(weekIndex == 5){
      $scope.jData.week_4 = {};
      $scope.jData.week_4 = weeklyBuild
      $scope.LastOne = {
                "fileName":localStorage.getItem("userName"),
                "data":$scope.jData
      };
    }
  };
 
//Initilizing the page
$scope.init();

$scope.commentOnThis =  function(weekID){
$scope.TasksCommentParams = {UserId : $scope.locaStorageUserData[0].UserID,WeekId : weekID,CommentedFor:$scope.ManagersUserID};    
var commentList = BasicService.getParticularTaskComments($scope.TasksCommentParams);
      commentList.then(function (response) {
        $scope.AdmEmpCommentList =response;
       
        $scope.AllComments = getAllTask(weekID);  
});  

var options = {
        scope: $scope,
        message: "Message",
        title: "Comments on Week "+weekID ,
        className: 'test-class',
        templateUrl: 'templates/ViewManagerComments.html',
        buttons: {
             warning: {
                 label: "Close",
                 className: "btn-warning",
                 callback: function() {  
                    // Do Somthing
                 }
             }
        }
    };
$ngBootbox.customDialog(options);
};
function getAllTask(weekId){
  var comments = [];

  for(var i=0;i<$scope.AdmEmpCommentList.length;i++){
    if($scope.AdmEmpCommentList[i].CommentedText != null && $scope.AdmEmpCommentList[i].CommentedText != "" ){
      
      var cBy = $filter('filter')($scope.UsersInfo,{'UserID' : $scope.AdmEmpCommentList[i].UserID});
      
      var cFor = $filter('filter')($scope.UsersInfo,{'UserID' : $scope.AdmEmpCommentList[i].CommentedFor});
      
      var build = {
                  "commentedBy":cBy[0].FirstName+' '+cBy[0].MiddleName+' '+cBy[0].LastName,
                  "commentedFor": cFor[0].FirstName+' '+cFor[0].MiddleName+' '+cFor[0].LastName,
                  "date":$scope.AdmEmpCommentList[i].ComentedDate,
                  "TaskId":$scope.AdmEmpCommentList[i].TaskID,
                  "commentText":$scope.AdmEmpCommentList[i].CommentedText,
                    
      };
      
      comments.push(build);
    }
  }
  return comments;
}

});
/*
 * Login Controller
 */
 app.controller('LoginCtrl', function ($scope, $location, $http,BasicService,$ngBootbox) {
  localStorage.clear();
  $scope.ShowManager= false;
  //console.log("LoginCtrl Controller loaded..");
  //Conver Special charachters into actual URL 
  $scope.ShowManagerFun = function()
  {
	 $scope.ShowManager= true;
  }
  $scope.ShowManagerFun1 = function()
  {
	 $scope.ShowManager= false;
  }
  String.prototype.allReplace = function(obj) {
			var retStr = this;
			for (var x in obj) {
				retStr = retStr.replace(new RegExp(x, 'g'), obj[x]);
			}
			return retStr;
		};
  //End		
  $scope.auth = {};
  $scope.authenticateUser = function(){
    //alert($scope.loginAS);return;
    if($scope.loginAS != undefined){
    
      if($scope.auth.userName!="" && $scope.auth.userName != undefined && $scope.auth.password!="" && $scope.auth.password != undefined){
      //$scope.auth.password = $scope.auth.password.allReplace({'&': '%26', '#': '%23', '$':'%24', '!':'%21' });  
      var IsAuth = BasicService.authenticateUser({"username":$scope.auth.userName,password:$scope.auth.password});
                   IsAuth.then(function (data) {
                    if(data.status == 1){
                      
                      var IsExistInDB = BasicService.IsUserExist({"globalID":$scope.auth.userName});
                      IsExistInDB.then(function (data) {
                        if(data.status == "1"){
                              // Fetch Basic Profile From DB User's Table
                            //alert(angular.toJson(data.response));
                            localStorage.setItem("UserData",angular.toJson(data.response));
                            //return;
                              // Check loggedIn User Designation
                              var desigSplit = data.response[0].Designation.split(' ');
                              //desigSplit.indexOf("Manager") == -1
                            //if(desigSplit.indexOf("Manager") == -1){
                              if($scope.loginAS == 'employee'){
                              // Fetch JSON Task Data From Taskseet JSON.
                              // Redirect To Employee Home
                              $location.path('/status');
                            
                              
                            }else{
                              // Redirect To manager's Dashboard  
                              $location.path('/manager');
                            }
                        }else{
                            $ngBootbox.alert({
                              message: "Yor are logging in for the first time, Please wait. It will take some time to create your profile. Thanks",
                              size: 'medium'
                             
                            });
                              // If Not Found
                              // Fetch Employee Profile JCI API (Through GlobalID)
                            var dataFromJCI = BasicService.getBasicProfileUsingGloablId({"globalID":$scope.auth.userName});
                            dataFromJCI.then(function (response) {

                              if(response.status == 1) {
                                var designationSplit = response.data.Designation.split(' ');
                                
                                  $scope.EmpResponseFrmApi = response.data;
                                  if( response.data.Manager != undefined && response.data.Manager != ""){
                                    var managerDetails = response.data.Manager.split(',');
                                    var getGlobalID = managerDetails[0].split('=');
                                    var MgrGlobalId = getGlobalID[1];
                                    // Fetch His Manager's Profile JCI API (Through GlobalID)
                                    var dataForManagerDetails = BasicService.getBasicProfileUsingGloablId({"globalID":MgrGlobalId});
                                    dataForManagerDetails.then(function (managerResponse) {
                                        if(managerResponse.status == 1){
                                         //Get GlobalID for Manager 2's 
                                          var managerDetails2 = managerResponse.data.Manager.split(',');
                                          var managerGId2 = managerDetails2[0].split('=');
                                          var MgrGlobalId2 = managerGId2[1];
                                          //alert(MgrGlobalId2);


                                          $scope.MgrResponseFrmApi = managerResponse.data;
                                          // Save into Our Own DB Tables
                                          // 1. Users
                                          var nameSplit = $scope.EmpResponseFrmApi.UserName.split(' ');
                                          var lastName = "";
                                          if(nameSplit.length == 3){
                                              lastName = nameSplit[2];
                                          }
                                          var managerNameSplit = $scope.MgrResponseFrmApi.UserName.split(' ');
                                          var MgrLastName = "";
                                          if(managerNameSplit.length == 3){
                                              MgrLastName = managerNameSplit[2];
                                          }
                                          $scope.EntryUsersParam = {"GlobalId":$scope.auth.userName,"FirstName":nameSplit[0],"MiddleName":nameSplit[1],"LastName":lastName,"Designation":$scope.EmpResponseFrmApi.Designation,"Email":$scope.EmpResponseFrmApi.MAIL,"ManagerId":MgrGlobalId}; 
                                          $scope.EntryManagerParam = {
                                            "GlobalId":MgrGlobalId,
                                            "FirstName":managerNameSplit[0],
                                            "MiddleName":managerNameSplit[1],
                                            "LastName":MgrLastName,
                                            "Designation":$scope.MgrResponseFrmApi.Designation,
                                            "Email":$scope.MgrResponseFrmApi.MAIL,
                                            "ManagerId":MgrGlobalId2
                                          }; 
                                          
                                          var entryInUsers = BasicService.createUserEntryInUsers($scope.EntryUsersParam);
                                          entryInUsers.then(function (UserEntryResponse) {
                                          if(UserEntryResponse.status == 1){
                                            //Registering Manager On Employees First Time Login
                                              var IsManagerExistInDB = BasicService.IsUserExist({"globalID":MgrGlobalId});
                                              IsManagerExistInDB.then(function (data) {
                                                if(data.status == "0"){ 
                                                      var entryManagerInUsers = BasicService.createUserEntryInUsers($scope.EntryManagerParam);
                                                      entryManagerInUsers.then( function (mgrResponse){
                                                        console.log("Manager Registered Successfully");
                                                      });
                                                }
                                              });
                                            
                                            var GetEnteredUser = BasicService.IsUserExist({"globalID":$scope.auth.userName});
                                            GetEnteredUser.then(function (data) {

                                                if(data.status == "1"){ 
                                                  localStorage.setItem("UserData",angular.toJson(data.response));
                                                  $scope.UserId = data.response[0].UserID;


                                                    //if(designationSplit.indexOf("Manager") == -1){
                                                       if($scope.loginAS == 'employee'){
                                                    // It means logged in user is Employee 
                                                    // 2. TaskSheet

                                                    var fileData = BasicService.getStaticFileData();
                                                    fileData.then(function (data) {
                                                      $scope.TaskJSON = data;
                                                      $scope.EntryTaskSheetParam = {"UserId":$scope.UserId,"TaskJSON":$scope.TaskJSON,"Status":"Active"};
                                                      var entryInTasksheet = BasicService.createUserTaskInTasksheet($scope.EntryTaskSheetParam);
                                                      entryInTasksheet.then(function (TaskSheetEntryResponse) {
                                                      if(TaskSheetEntryResponse.status == 1){ 
                                                      // 3. Redirect to Respective Page
                                                        $location.path('/welcome');
                                                    }  
                                                    })
                                                    });

                                                  
                                                    
                                                    }else{
                                                    // It means logged in user is manager , Redirect to Manager's Dashboard
                                                       //alert("Manager's Dashboard");
                                                       $location.path('/manager');
                                                    } 




                                                 
                                                }else{
                                                  $ngBootbox.alert({
                                                    message: "Not Registered",
                                                    size: 'small'
                                                   
                                                  });
                                                } 
                                            })
                                          }

                                        //}
                                  })
                                  
                                 
                                }else{
                                  // No manager Assign to this Employee
                                    $ngBootbox.alert({
                                      message: "No manager assigned",
                                      size: 'small'
                                     
                                    });

                                }
                              })
                           
          }

							}
                  })
}
					})
				   
                }else{
                      $ngBootbox.alert({
                        message: "Invalid User",
                        size: 'small'
                       
                      });
                    }
      })

				   }else{
                    $ngBootbox.alert({
                        message: "Please enter valid GlobalID and Password",
                        size: 'medium'
                       
                    });
           }
	
	
  }else{
	                 $ngBootbox.alert({
                        message: "Please Select Login as",
                        size: 'small'
                       
                    });
  }
  }
              
});

/*
 * Manager Controller
 */
 app.controller('ManagerCtrl', function ($scope, $location, $http,BasicService,$routeParams,$ngBootbox,$filter,$route) {
  console.log("ManagerCtrl Controller loaded..");
  $scope.UsersInfo = [];
  var buildObject = {};
  //$scope.candidateCompleteJSON = [];
  $scope.locaStorageUserData = JSON.parse(localStorage.getItem("UserData"));
  //alert(typeof $scope.locaStorageUserData);
  $scope.userName = $scope.locaStorageUserData[0].FirstName+' '+$scope.locaStorageUserData[0].MiddleName+' '+$scope.locaStorageUserData[0].LastName;
  //alert($scope.userName);
  $scope.buildObjects = "";
  $scope.jsonPara = {"globalId": $scope.locaStorageUserData[0].GlobalID};
  if($scope.jsonPara){
  $scope.managerParams = {"UserId":$scope.locaStorageUserData[0].UserID};
  var ManagerBasicInfo = BasicService.getUserBasicInfo($scope.managerParams);
      ManagerBasicInfo.then(function (response) {
        $scope.ManagerBasicInfo =response[0];
  });
  getUserInfo($scope.locaStorageUserData[0].UserID);    
  }
  $scope.myData = [];
  $scope.gridOptions = { 
    paginationPageSizes: [10,25,50,75,100],
    paginationPageSize: 10,
    columnDefs: [
      { name: 'SrNo',enableHiding:false },
      { name: 'Name',enableHiding:false },
      { name: 'Week',enableHiding:false },
      { name: 'Status',enableHiding:false },
      { name: 'UserId', visible:false },
      { name: 'Action',enableHiding:false, cellTemplate: '<div><center><a id="actionButton" ng-click="grid.appScope.editWeek(row.entity.UserId,row.entity.Week)" class="btn btn-warning btn-xs" title="Edit Activity"> <span class="glyphicon glyphicon-edit"> EDIT</span></a>  </div>',enableSorting: false}
    ],
    data : 'myData' }; 
  var dashboardData = BasicService.getManagerDashboard($scope.jsonPara);
  dashboardData.then(function (response) {


    if(response.status == "1"){
      console.log(response.data);
      var res =  response.data;
      for(var i=0;i<res.length;i++){
          var buildObj = {};
          buildObj = {SrNo: res[i].SrNo, GlobalID: res[i].GlobalID,Name:res[i].Name,Week:res[i].WeekId,Status:res[i].Status,UserId:res[i].UserID};
        
        $scope.myData.push(buildObj);
      }
      console.log("It Takes time");
        
    }else{

    }

                                                    
  });
    $scope.param1 = $routeParams.param1;
    $scope.param2 = $routeParams.param2;
  $scope.editWeek = function(userId,week){
    if(userId != 'undefined' && week != 'undefined'){
      $location.path('/editWeek/'+userId+'/'+week);
    }
  };
  $scope.param1 = $routeParams.param1;
  $scope.param2 = $routeParams.param2;
  if($scope.param1){
  getUserInfo($scope.param1);  
  $scope.UserIDJson = {"UserId":$scope.param1};
  var UserBasicInfo = BasicService.getUserBasicInfo($scope.UserIDJson);
      UserBasicInfo.then(function (response) {
        $scope.UserBasicInfo =response[0];
  }); 
  }

  if($scope.UserEmployeeInfo && $scope.UserManagerInfo){
   
    $scope.UsersInfo = $scope.UserEmployeeInfo.concat($scope.UserManagerInfo);
  }
  $scope.WeeksObj = {};
  $scope.modalObj = {};
  $scope.TableData = [];
  $scope.IsApprovedList = [];
  $scope.AdmEmpCommentList = [];
  $scope.TaskAppParams = {UserId : $scope.param1,WeekId : $scope.param2};
  var da = BasicService.getParticularTaskApprovedorReject($scope.TaskAppParams);
      da.then(function (response) {
        $scope.IsApprovedList =response;
        $scope.IsApprovedList = $filter('filter')($scope.IsApprovedList, {"IsTaskApproved":''});
  });
  $scope.TasksCommentParams = {UserId : $scope.locaStorageUserData[0].UserID,WeekId : $scope.param2,CommentedFor:$scope.param1};    
  var commentList = BasicService.getParticularTaskComments($scope.TasksCommentParams);
      commentList.then(function (response) {
        $scope.AdmEmpCommentList =response;
        //alert(angular.toJson($scope.AdmEmpCommentList));
  });
  if($scope.param1 != 'undefined' && $scope.param2 != 'undefined'){
      $scope.weekParams =  {"UserId": $scope.param1,"WeekId": $scope.param2};
      var editDashboardData = BasicService.viewTaskManager($scope.weekParams);
      editDashboardData.then(function (response) {
         console.log(typeof response); 
          $scope.WeeksObj.week = response;
          $scope.WeeksObj.week.Assignment =  response.Assignment;
          $scope.WeeksObj.week.Status = response.assignStatus; 
      for(var i = 0; i< $scope.WeeksObj.week.Assignment.length;i++){
        $scope.indicators($scope.WeeksObj.week.Status);
        var pushThis = {
              SrNo:i+1,
              TaskId:$scope.WeeksObj.week.Assignment[i].id,
              name:$scope.WeeksObj.week.Assignment[i].name,
              Estimation: $scope.WeeksObj.week.Assignment[i].E_Time,
              ActualTime: $scope.WeeksObj.week.Assignment[i].A_Time,
              CompletionDate: $scope.WeeksObj.week.Assignment[i].date,
              Status: $scope.modalObj.weekStatus,
              Class: $scope.modalObj.weekStatusClass,
              SubTask: JSON.stringify($scope.WeeksObj.week.Assignment[i].subtask),
              Descriptions: $scope.WeeksObj.week.Assignment[i].Desc,
              CommentedFor:$scope.param1,
              UserId:$scope.locaStorageUserData[0].UserID,
              WeekId:$scope.param2,
              IsApproved:checkApprovedOrNot($scope.WeeksObj.week.Assignment[i].id),
              AllComments:getAllTask($scope.WeeksObj.week.Assignment[i].id),
              Action: i
        };
        $scope.TableData.push(pushThis);

      }
      console.log(angular.toJson($scope.TableData));

      }); 


  }
function checkApprovedOrNot(taskId){
  var returnFlag;
//   alert( angular.toJson($scope.IsApprovedList));return;
  for(var k=0;k<$scope.IsApprovedList.length;k++){
    
    if($scope.IsApprovedList[k].TaskID == taskId){
      if($scope.IsApprovedList[k].IsTaskApproved === true){
        returnFlag = 1;
      }else if($scope.IsApprovedList[k].IsTaskApproved === false){
        returnFlag = 0;
      }else if($scope.IsApprovedList[k].IsTaskApproved === null){
        //alert($scope.IsApprovedList[k].IsTaskApproved);
        returnFlag = -1;
      }
    }

  }
  //alert(returnFlag);
  if(returnFlag === 1){
    return true;
  }else if(returnFlag === 0){
    return false;
  }else if(returnFlag === -1){
    return -1;
  }else{
    return -1;
  }

}
function getAllTask(taskId){
  var comments = [];
  for(var i=0;i<$scope.AdmEmpCommentList.length;i++){
    if($scope.AdmEmpCommentList[i].TaskID == taskId && $scope.AdmEmpCommentList[i].CommentedText != null && $scope.AdmEmpCommentList[i].CommentedText != "" ){
      var cBy = $filter('filter')($scope.UsersInfo,{'UserID' : $scope.AdmEmpCommentList[i].UserID});
      var cFor = $filter('filter')($scope.UsersInfo,{'UserID' : $scope.AdmEmpCommentList[i].CommentedFor});
      var build = {
                  "commentedBy":cBy[0].FirstName+' '+cBy[0].MiddleName+' '+cBy[0].LastName,
                  "commentedFor": cFor[0].FirstName+' '+cFor[0].MiddleName+' '+cFor[0].LastName,
                  "date":$scope.AdmEmpCommentList[i].ComentedDate,
                  "commentText":$scope.AdmEmpCommentList[i].CommentedText,
                    
                };
      comments.push(build);
    }
  }
  return comments;
}
function getUserInfo(userId){
  $scope.commentsParams = {"UserId":userId};
  var CommenterName = BasicService.getUserInfo($scope.commentsParams);
      CommenterName.then(function (response) {
       $scope.UsersInfo.push(response[0]);
  });
}
$scope.approveThis = function(rec){
  $scope.WeekStatusCertifications = JSON.parse(rec.SubTask);
  $scope.subTaskCertList = [];
  angular.forEach($scope.WeekStatusCertifications,function(value, keys){
    var data = {
      SubTaskID : keys,
      SubTaskName : value,
      Certificate : "N/A",
    };
        $scope.subTaskCertList.push(data);
  });
  $scope.subTaskData =angular.toJson($scope.subTaskCertList);
  //angular.element(".btn-success").addClass("disabled",true);

  var options = {
        scope: $scope,
        message: rec,
        title: rec.name+" -  Approval" ,
        className: 'test-class',
        templateUrl: 'templates/Approve.html',
        buttons: {
             warning: {
                 label: "Cancel",
                 className: "btn-warning",
                 callback: function() {  
                    // Do Somthing
                 }
             },
             success: {
                 label: "Approve",
                 className: "btn-success",
                 callback: function() {  
                  // Do Somthing
                  $scope.approvalText=  angular.element('#approvalComments').val();
                  if($scope.approvalText != ""){
                    var currentPath = 'http://localhost:1337/#'+ $location.url();
                    $scope.loader=true;
                    var IsTaskApproved = 'true';
                    var CommentedDate = new Date();
                    var CommentedFor = rec.CommentedFor;
                    var CommentedText =  $scope.approvalText;
                    var Status = "Active";  
                  
                    $scope.approvaPara = {"UserId":rec.UserId,"WeekId":rec.WeekId,"TaskId":rec.TaskId,"IsTaskApproved" : IsTaskApproved,"ComentedDate" : CommentedDate,"CommentedFor":CommentedFor,"CommentedText" : $scope.approvalText ,"Status": Status,"SubTaskID":null};
                    $scope.sendAnEmail($scope.UsersInfo,$scope.approvaPara,'Approve');
                    var approvalStatus = BasicService.setTaskApprovedorReject($scope.approvaPara);
                    approvalStatus.then(function (response) { 
                      if(response.status == 1){
                        $route.reload();
                      }else{
                        alert("Somthing went wrong, Please try again");
                      }
                    });
                }else{

                    return false;
                }                  
                 }
             }
        }
    };
$ngBootbox.customDialog(options);    
};

$scope.rejectThis = function(rec){
  $scope.WeekStatusCertifications = JSON.parse(rec.SubTask);
  $scope.subTaskCertList = [];
  angular.forEach($scope.WeekStatusCertifications,function(value, keys){
    var data = {
      SubTaskID : keys,
      SubTaskName : value,
      Certificate : "N/A",
      TaskId : rec.TaskId
    };
        $scope.subTaskCertList.push(data);
  });
  $scope.subTaskData =angular.toJson($scope.subTaskCertList);
    $scope.selectAll = false;
    var buildObject = {};
    //$scope.candidateCompleteJSON = [];
    angular.forEach($scope.subTaskCertList, function(records) {
        buildObject[records.SubTaskID] = 1;
    });
    //alert(angular.toJson(buildObject));

    $scope.individualCheckList = function(subTaskID){
    if($scope.subTask){
      angular.forEach($scope.subTaskCertList, function(records) {
        if(subTaskID == records.SubTaskID){
            buildObject[records.SubTaskID] = 1;
        }
      });
    }else{
       angular.forEach($scope.subTaskCertList, function(records) {
        if(subTaskID == records.SubTaskID){
            buildObject[records.SubTaskID] = 0;
        }
      });
    }
    //alert(angular.toJson(buildObject));
    //return;
    $scope.buildObjects = "Sumit";
    var completeJSON = BasicService.getCompleteJSON({"UserId":$scope.param1}); 
          completeJSON.then(function (data) {
             if(data){
              $scope.candidateCompleteJSON = data;
              if($scope.param2 == 1){
                 $scope.candidateCompleteJSON.week_1.assignStatus[$scope.subTaskCertList[0].TaskId-1] = buildObject;
              }else if($scope.param2 == 2){
                 $scope.candidateCompleteJSON.week_2.assignStatus[$scope.subTaskCertList[0].TaskId-1] = buildObject;
              }else if($scope.param2 == 3){
                 $scope.candidateCompleteJSON.week_3.assignStatus[$scope.subTaskCertList[0].TaskId-1] = buildObject;
              }else if($scope.param2 == 4){
                 $scope.candidateCompleteJSON.week_4.assignStatus[$scope.subTaskCertList[0].TaskId-1] = buildObject;  
              }
             }
          });
  };

  var options = {
        scope: $scope,
        message: rec,
        title: rec.name+" -  Rejection" ,
        className: 'test-class',
        templateUrl: 'templates/Reject.html',
        buttons: {
             warning: {
                 label: "Cancel",
                 className: "btn-warning",
                 callback: function() {  
                    // Do Somthing
                 }
             },
            danger: {
                 label: "Reject",
                 className: "btn-danger",
                 callback: function() {  
                  // Do Somthing 
                    var IsTaskApproved = 'false';
                    var CommentedDate = new Date();
                    var CommentedFor = rec.CommentedFor;
                    var CommentedText =  $scope.approvalText;
                    var Status = "Active";
                     
                  $scope.approvalText=  angular.element('#approvalComments').val();
                  $scope.approvaPara = {"UserId":rec.UserId,"WeekId":rec.WeekId,"TaskId":rec.TaskId,"IsTaskApproved" : IsTaskApproved,"ComentedDate" : CommentedDate,"CommentedFor":CommentedFor,"CommentedText" : $scope.approvalText ,"Status": Status,"SubTaskID":buildObject};
                  var approvalStatus = BasicService.setTaskApprovedorReject($scope.approvaPara);
                  approvalStatus.then(function (response) { 
                    if(response.status == 1){
                      $scope.assignStatusParams = {UserId :CommentedFor,TaskJSON:$scope.candidateCompleteJSON};
                        var changeAssignStatus = BasicService.setCompleteJSON($scope.assignStatusParams);
                        changeAssignStatus.then(function (response) {
                            $scope.sendAnEmail($scope.UsersInfo,$scope.approvaPara,'Reject');
                            var setIsMailSent = BasicService.OnRejectChangeIsMailSent({"WeekId":rec.WeekId,"UserId":rec.CommentedFor});
                            setIsMailSent.then(function (response) {
                                $route.reload();
                            });
                        });
                    }else{
                      alert("Somthing went wrong, Please try again");
                    }
                  });
                  
                 }
             }
        }
    };
$ngBootbox.customDialog(options);  
};

$scope.commentOnThis =  function(rec){
  
$scope.AllComments = rec.AllComments;
var options = {
        scope: $scope,
        message: "Message",
        title: "Comments on "+rec.name ,
        className: 'test-class',
        templateUrl: 'templates/Comment.html',
        buttons: {
             warning: {
                 label: "Cancel",
                 className: "btn-warning",
                 callback: function() {  
                    // Do Somthing
                 }
             },
             success: {
                 label: "Ok",
                 className: "btn-success",
                 callback: function() {  
                  // Do Somthing 
                  $scope.approvalText=  angular.element('#managerCommentBox').val();
                  if($scope.approvalText != ""){
                  var IsTaskApproved = null;
                  var CommentedDate = new Date();
                  var CommentedFor = rec.CommentedFor;
                  var CommentedText =  $scope.approvalText;
                  var Status = "Active";  
                  
                  
                  $scope.approvaPara = {"UserId":rec.UserId,"WeekId":rec.WeekId,"TaskId":rec.TaskId,"IsTaskApproved" : IsTaskApproved,"ComentedDate" : CommentedDate,"CommentedFor":CommentedFor,"CommentedText" : $scope.approvalText ,"Status": Status};
                  var approvalStatus = BasicService.SaveUserComents($scope.approvaPara);
                  approvalStatus.then(function (response) { 
                      console.log("Response"+response);
                      if(response.status == 1){
                        $route.reload();
                      }
                  });
                }else{
                    return false;
                }
              }
          }
        }
    };
$ngBootbox.customDialog(options);
};

$scope.showDescription = function(desc){
$scope.empDescription = desc;
var options = {
        scope: $scope,
        message: "Thsi sis ",
        title: "Employee Comment" ,
        className: 'test-class',
        templateUrl: 'templates/EmployeeCommments.html',
        buttons: {
             success: {
                 label: "Ok",
                 className: "btn-success",
                 callback: function() {  
                  // Do Somthing 
                 }
             }
        }
    };
$ngBootbox.customDialog(options);
};

  $scope.indicators = function(statusDetails)
  {
  var week = $scope.param2;
  //Checking week
    if(week == 1){
      var weektaskCompleted =0;
    var weeksubtask =0;
    for (var i = 0; i < statusDetails.length; i++) {
      var cnt= 0;
      var allnode=0;

    angular.forEach(statusDetails[i], function(value, keys){
                  allnode++;
          if (value == 1) {
            cnt++;
            }
        });
        if(allnode == cnt)
        {   

          weektaskCompleted++;
          $scope.modalObj.weekStatus = "Completed";
          $scope.modalObj.weekStatusClass="btn-success";
        }
        else if(cnt >0 && cnt < allnode)
        {

          weeksubtask++;
          $scope.modalObj.weekStatus = "In Progress";
          $scope.modalObj.weekStatusClass="btn-warning";
        }
        else if(cnt == 0){

          $scope.modalObj.weekStatus = "Not Started";
          $scope.modalObj.weekStatusClass="btn-danger";
        }

    }
      if(weektaskCompleted == 8)
      {
          $scope.modalObj.weekStatus = "Completed";
          $scope.modalObj.weekStatusClass="btn-success";
              
      }else{
        if(weektaskCompleted > 0 || weeksubtask > 0){
          $scope.modalObj.weekStatus = "In Progress";
          $scope.modalObj.weekStatusClass="btn-warning";
        }
    else{
          $scope.modalObj.weekStatus = "Not Started";
          $scope.modalObj.weekStatusClass="btn-danger";
        }
      }
    }else if(week ==2){
      var weektaskCompleted =0;
    var weeksubtask =0;
       for (var i = 0; i < statusDetails.length; i++) {
      var cnt= 0;
      var allnode=0;
    angular.forEach(statusDetails[i], function(value, keys){
                  allnode++;
          if (value == 1) {
            cnt++;
          }
        });
        if(allnode == cnt)
        {
          $scope.modalObj.weektatus = "Completed";
          $scope.modalObj.weekStatusClass="btn-success";
          weektaskCompleted++;
        } 
        else if(cnt >0 && cnt < allnode)
        {
          weeksubtask++;
          $scope.modalObj.weekStatus = "In Progress";
          $scope.modalObj.weekStatusClass="btn-warning";
        }else if(cnt == 0){
          $scope.modalObj.weekStatus = "Not Started";
          $scope.modalObj.weekStatusClass="btn-danger";
        }
        }   
    
    if(weektaskCompleted == 5)
    {
      //$scope.modalObj.weektatus = "Completed";
      //$scope.modalObj.weekStatusClass="btn-success";
    
    }else{
      if(weektaskCompleted > 0 || weeksubtask > 0 )  {
          //$scope.modalObj.weekStatus = "In Progress";
          //$scope.modalObj.weekStatusClass="btn-warning";
        }
     else{
          //$scope.modalObj.weekStatus = "Not Started";
          //$scope.modalObj.weekStatusClass="btn-danger";
        } 
       
    }
    
    }else if(week == 3){
      var weektaskCompleted =0;
      var weeksubtask =0;
       for (var i = 0; i < statusDetails.length; i++) {
      var cnt= 0;
      var allnode=0;
    angular.forEach(statusDetails[i], function(value, keys){
                  allnode++;
          if (value == 1) {
            cnt++;
    }
        });
        if(allnode == cnt)
        {
          weektaskCompleted++
          $scope.modalObj.weekStatus = "Completed";
          $scope.modalObj.weekStatusClass="btn-success";
        }
        else if(cnt >0 && cnt<allnode)
        {
          weeksubtask++;
          $scope.modalObj.weekStatus = "In Progress";
          $scope.modalObj.weekStatusClass="btn-warning";
        }
        else if(cnt == 0){
          $scope.modalObj.weekStatus = "Not Started";
          $scope.modalObj.weekStatusClass="btn-danger";
        }
    
    }
      if(weektaskCompleted == 11)
      {
        //$scope.modalObj.weekStatus = "Completed";
        //$scope.modalObj.weekStatusClass="btn-success";
      }else{
        if(weektaskCompleted > 0 || weeksubtask > 0){
          //$scope.modalObj.weekStatus = "In Progress";
          //$scope.modalObj.weekStatusClass="btn-warning";
        }else{
          //$scope.modalObj.weekStatus = "Not Started";
          //$scope.modalObj.weekStatusClass="btn-danger";
        }
      }
    
    }else if(week == 4){
      var weektaskCompleted =0;
    var weeksubtask =0;
       for (var i = 0; i < statusDetails.length; i++) {
      var cnt= 0;
      var allnode=0;
    angular.forEach(statusDetails[i], function(value, keys){
                  allnode++;
          if (value == 1) {
            cnt++;
          }
        });
        if(allnode == cnt)
        {
          $scope.modalObj.weekStatus = "Completed";
          $scope.modalObj.weekStatusClass="btn-success";
          weektaskCompleted++;
        } 
        else if(cnt >0 && cnt<allnode)
        {
        weeksubtask++;
          $scope.modalObj.weekStatus = "In Progress";
          $scope.modalObj.weekStatusClass="btn-warning"
        } 
        else if(cnt == 0){
          $scope.modalObj.weekStatus = "Not Started";
          $scope.modalObj.weekStatusClass="btn-danger"
        } 
    }
      if(weektaskCompleted == 6) 
      {
        $scope.modalObj.weekStatus = "Completed";
        $scope.modalObj.weekStatusClass="btn-success";
      }else{
        if(weektaskCompleted > 0 || weeksubtask > 0){
          $scope.modalObj.weekStatus = "In Progress";
          $scope.modalObj.weekStatusClass="btn-warning"
        }else{
          $scope.modalObj.weekStatus = "Not Started";
          $scope.modalObj.weekStatusClass="btn-danger"
        }
      }
    
    }
  }
// Mails On Approval and Rejection

    $scope.sendAnEmail = function(UsersInfo,TaskInfo,MailType){
    var managerData = [];
    var EmployeeData = [];
    managerData = $filter('filter')(UsersInfo,{'UserID':TaskInfo.UserId});
    EmployeeData = $filter('filter')(UsersInfo,{'UserID':TaskInfo.CommentedFor});

    var ManagerName = managerData[0].FirstName+' '+managerData[0].MiddleName+' '+managerData[0].LastName;
    var EmployeeName =  EmployeeData[0].FirstName+' '+EmployeeData[0].MiddleName+' '+EmployeeData[0].LastName;

    
                var mailOptions = {
                 
                  from: managerData[0].Email, //Manager's Email Id
                  to: EmployeeData[0].Email, //Employee's Email ID
                  subject: 'STEI Approval Rejection Report | '+ManagerName,
                  html:'<div>'
                          +'<h2>STEI Approval Rejection Email</h2>'
                          +'<p>Hello,</p>'
                        +'<p>'+EmployeeName
                        +'<p>Assignment Approva/Rejection Details:</p>'
                        +'<br />'
                        +'<table style="border: 1px solid #ddd; text-align: left; border-collapse: collapse; width: 100%;">'
    +'<thead>'
      +'<tr>'
        +'<th style="border: 1px solid #ddd; text-align: left; padding: 15px;">Week</th>'
        +'<th style="border: 1px solid #ddd; text-align: left; padding: 15px;">Assignment Name</th>'
        +'<th style="border: 1px solid #ddd; text-align: left; padding: 15px;">Manager Comment</th>'
    +'<th style="border: 1px solid #ddd; text-align: left; padding: 15px;">Status</th>'
    +'<th style="border: 1px solid #ddd; text-align: left; padding: 15px;">Date</th>'
      +'</tr>'
    +'</thead>'
    +'<tbody>'
      +'<tr>'
        +'<td style="border: 1px solid #ddd; text-align: left; padding: 15px;">'+TaskInfo.WeekId+'</td>'
    +'<td style="border: 1px solid #ddd; text-align: left; padding: 15px;">'+TaskInfo.TaskId+'</td>'
        +'<td style="border: 1px solid #ddd; text-align: left; padding: 15px;">'+TaskInfo.CommentedText+'</td>'
    +'<td style="border: 1px solid #ddd; text-align: left; padding: 15px;">'+MailType+'</td>'
    +'<th style="border: 1px solid #ddd; text-align: left; padding: 15px;">'+TaskInfo.CommentedDate+'</th>'
      +'</tr>'
    +'</tbody>'
  +'</table>'
               
              };
             //alert(angular.toJson(mailOptions));return;
          var sentMail = BasicService.sendApprovalRejectionMail(mailOptions); 
          sentMail.then(function (data) {
              if(data.status == "1"){
                console.log("Mail Sent Succfully");
              }else if(data.status == "0"){
                console.log("Somthing is wrong in web server")
              }else{
                console.log("API is Not calling");
              }
          });
              


  };
 
$scope.menuClick = function()
	{
	  if(angular.element('.slideupMenu').css('display')== 'none')
		{
		angular.element('.slideupMenu').css('display', 'block');
		}
		else{
		   angular.element('.slideupMenu').css('display', 'none');
		}
	};
	
   $scope.Logout = function()
   {
	   localStorage.clear();
	   $location.path('/');
   }	   
  
});
