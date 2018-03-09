/*
 * Angular 1.x.x
 * @author Sumit K
 */

/*
 * Main AngularJS Web Application
 */
var app = angular.module('mainApp.service', [
 
]);

/*
 * Angular JS Services
 */
 app.service('BasicService', function ($http,$q,$log) {
            
           
			this.getJSONDATA = function (fileName){
		    var deferred = $q.defer();
			$http({
				method  : 'GET',
				url     : 'data/files/'+fileName+'.json',
				params  : {},  
				
			}).success(function(response, status, headers, config) {
                        deferred.resolve(response);
						
            }).error(function(response, status, headers, config) {
						deferred.reject(response);
						$log.error(response, status);

			});
			return deferred.promise;
			};
		   this.getJSONDataFromTable = function (json){
		    var deferred = $q.defer();
			$http({
				method  : 'POST',
				url     : 'http://localhost:1337/api/getData',
				params  : json,  
				
			}).success(function(response, status, headers, config) {
                        deferred.resolve(response);
						
            }).error(function(response, status, headers, config) {
						deferred.reject(response);
						$log.error(response, status);

			});
			return deferred.promise;
			};
			this.getStaticFileData = function(){

  			var deferred = $q.defer();
			$http({
				method  : 'GET',
				url     : 'data/task.json',
				params  : {}, 
				
			}).success(function(response, status, headers, config) {
                        deferred.resolve(response);
						
            }).error(function(response, status, headers, config) {
						deferred.reject(response);
						$log.error(response, status);

			});
			return deferred.promise;
		
			};
			/*
			 *Checking User Data Existance
			 */
			this.IsUserExist = function(json){
				var deferred = $q.defer();
				console.log("json=="+angular.toJson(json));
			$http({
				method  : 'POST',
				url     : 'http://localhost:1337/api/checkUserExist',
				headers: {
        			"Content-Type": "application/json"
 				},
				params  : json, 
				
			}).success(function(response, status, headers, config) {
                        deferred.resolve(response);
						
            }).error(function(response, status, headers, config) {
						deferred.reject(response);
						$log.error(response, status);

			});
			return deferred.promise;
			};
			/*
			 * Create User When Logged in for first time (Entry In Users Table)
			 * Post Authentication
			 */
			this.createUserEntryInUsers = function(json){
				var deferred = $q.defer();
			$http({
				method  : 'POST',
				url     : 'http://localhost:1337/api/createUserEntryInUsers',
				headers: {
        			"Content-Type": "application/json"
 				},
				params  : json, 
				
			}).success(function(response, status, headers, config) {
                        deferred.resolve(response);
							
            }).error(function(response, status, headers, config) {
						deferred.reject(response);
						$log.error(response, status);

			});
			return deferred.promise;
			};
			/*
			 * Create User When Logged in for first time (Entery in TaskSheet Table)
			 * Post Authentication
			 */
			this.createUserTaskInTasksheet = function(json){
				var deferred = $q.defer();
			$http({
				method  : 'POST',
				url     : 'http://localhost:1337/api/createUserTaskInTasksheet',
				headers: {
        			"Content-Type": "application/json"
 				},
				params  : json, 
				
			}).success(function(response, status, headers, config) {
                        deferred.resolve(response);
							
            }).error(function(response, status, headers, config) {
						deferred.reject(response);
						$log.error(response, status);

			});
			return deferred.promise;
			};


			this.saveDetails = function(json){
				var deferred = $q.defer();
			$http({
				method  : 'POST',
				url     : 'http://localhost:1337/api/saveDetails',
				headers: {
        			"Content-Type": "application/json"
 				},
				params  : json, 
				
			}).success(function(response, status, headers, config) {
                        deferred.resolve(response);
						
            }).error(function(response, status, headers, config) {
						deferred.reject(response);
						$log.error(response, status);

			});
			return deferred.promise;
			};

			this.sendMail = function(json){
				console.log("Calling");
				var deferred = $q.defer();
			$http({
				method  : 'POST',
				url     : 'http://localhost:1337/api/sendWeeklyMail',
				headers: {
        			"Content-Type": "application/json"
 				},
				params  : json, 
				
			}).success(function(response, status, headers, config) {
                        deferred.resolve(response);
						
            }).error(function(response, status, headers, config) {
						deferred.reject(response);
						$log.error(response, status);

			});
			return deferred.promise;
			};
			this.getManagerDashboard = function(jsonPara){
				var deferred = $q.defer();
				$http({
					method  : 'POST',
					url     : 'http://localhost:1337/api/getManagerDashboard',
					headers: {
	        			"Content-Type": "application/json"
	 				},
					params  : jsonPara, 
					
				}).success(function(response, status, headers, config) {
	                        deferred.resolve(response);
							
	            }).error(function(response, status, headers, config) {
							deferred.reject(response);
							$log.error(response, status);

				});
				return deferred.promise;
			};
			this.viewTaskManager = function(jsonPara){
				var deferred = $q.defer();
				$http({
					method  : 'POST',
					url     : 'http://localhost:1337/api/viewWeeklyTaskManager',
					headers: {
	        			"Content-Type": "application/json"
	 				},
					params  : jsonPara, 
					
				}).success(function(response, status, headers, config) {
	                        deferred.resolve(response);
							
	            }).error(function(response, status, headers, config) {
							deferred.reject(response);
							$log.error(response, status);

				});
				return deferred.promise;
			};
			//setApproveReject
			this.setTaskApprovedorReject = function(jsonPara){
				var deferred = $q.defer();
				$http({
					method  : 'POST',
					url     : 'http://localhost:1337/api/setApproveReject',
					headers: {
	        			"Content-Type": "application/json"
	 				},
					params  : jsonPara, 
					
				}).success(function(response, status, headers, config) {
	                        deferred.resolve(response);
							
	            }).error(function(response, status, headers, config) {
							deferred.reject(response);
							$log.error(response, status);

				});
				return deferred.promise;
			};
			//getParticularTaskApprovalStatus
			this.getParticularTaskApprovedorReject = function(jsonPara){
				var deferred = $q.defer();
				$http({
					method  : 'POST',
					url     : 'http://localhost:1337/api/getParticularTaskApprovalStatus',
					headers: {
	        			"Content-Type": "application/json"
	 				},
					params  : jsonPara, 
					
				}).success(function(response, status, headers, config) {
	                        deferred.resolve(response);
							
	            }).error(function(response, status, headers, config) {
							deferred.reject(response);
							$log.error(response, status);

				});
				return deferred.promise;
			};
				//Get Particular Task's All Comments of Employee and Manager
			this.getParticularTaskComments = function(jsonPara){
				var deferred = $q.defer();
				$http({
					method  : 'POST',
					url     : 'http://localhost:1337/api/getParticularTaskComments',
					headers: {
	        			"Content-Type": "application/json"
	 				},
					params  : jsonPara, 
					
				}).success(function(response, status, headers, config) {
	                        deferred.resolve(response);
							
	            }).error(function(response, status, headers, config) {
							deferred.reject(response);
							$log.error(response, status);

				});
				return deferred.promise;
			};
				//Get User's Basic Info
			this.getUserBasicInfo = function(jsonPara){
				var deferred = $q.defer();
				$http({
					method  : 'POST',
					url     : 'http://localhost:1337/api/getBasicUserInfo',
					headers: {
	        			"Content-Type": "application/json"
	 				},
					params  : jsonPara, 
					
				}).success(function(response, status, headers, config) {
	                        deferred.resolve(response);
							
	            }).error(function(response, status, headers, config) {
							deferred.reject(response);
							$log.error(response, status);

				});
				return deferred.promise;
			};
			// Save Coments
			this.SaveUserComents = function(jsonPara){
				var deferred = $q.defer();
				$http({
					method  : 'POST',
					url     : 'http://localhost:1337/api/saveComents',
					headers: {
	        			"Content-Type": "application/json"
	 				},
					params  : jsonPara, 
					
				}).success(function(response, status, headers, config) {
	                        deferred.resolve(response);
							
	            }).error(function(response, status, headers, config) {
							deferred.reject(response);
							$log.error(response, status);

				});
				return deferred.promise;
			};
					//Get User's  Info
			this.getUserInfo = function(jsonPara){
				var deferred = $q.defer();
				$http({
					method  : 'POST',
					url     : 'http://localhost:1337/api/getUserInfo',
					headers: {
	        			"Content-Type": "application/json"
	 				},
					params  : jsonPara, 
					
				}).success(function(response, status, headers, config) {
	                        deferred.resolve(response);
							
	            }).error(function(response, status, headers, config) {
							deferred.reject(response);
							$log.error(response, status);

				});
				return deferred.promise;
			};
			//approval email
			this.sendApprovalRejectionMail = function(json){
				console.log("Calling");
				var deferred = $q.defer();
			$http({
				method  : 'POST',
				url     : 'http://localhost:1337/api/sendApprovalRejectionMail',
				headers: {
        			"Content-Type": "application/json"
 				},
				params  : json,
				
			}).success(function(response, status, headers, config) {
                        deferred.resolve(response);
						
            }).error(function(response, status, headers, config) {
						deferred.reject(response);
						$log.error(response, status);

			});
			return deferred.promise;
			};
			//Get Complete Employee's JSON
			this.getCompleteJSON = function(jsonPara){
				var deferred = $q.defer();
				$http({
					method  : 'POST',
					url     : 'http://localhost:1337/api/getCompleteJSON',
					headers: {
	        			"Content-Type": "application/json"
	 				},
					params  : jsonPara, 
					
				}).success(function(response, status, headers, config) {
	                        deferred.resolve(response);
							
	            }).error(function(response, status, headers, config) {
							deferred.reject(response);
							$log.error(response, status);

				});
				return deferred.promise;
			};
			//Set Complete Employee's JSON
			this.setCompleteJSON = function(jsonPara){
				var deferred = $q.defer();
				$http({
					method  : 'POST',
					url     : 'http://localhost:1337/api/setCompleteJSON',
					headers: {
	        			"Content-Type": "application/json"
	 				},
					params  : jsonPara, 
					
				}).success(function(response, status, headers, config) {
	                        deferred.resolve(response);
							
	            }).error(function(response, status, headers, config) {
							deferred.reject(response);
							$log.error(response, status);

				});
				return deferred.promise;
			};
			// Authenticate User Using GlobalID and Password
			this.authenticateUser = function(jsonPara){
				var deferred = $q.defer();
				$http({
					method  : 'POST',
					url     : 'http://localhost:1337/api/authenticateUser',
					headers: {
	        			"Content-Type": "application/json"
	 				},
					params  : jsonPara, 
					
				}).success(function(response, status, headers, config) {
	                        deferred.resolve(response);
							
	            }).error(function(response, status, headers, config) {
							deferred.reject(response);
							$log.error(response, status);

				});
				return deferred.promise;
			};
			// Get Basic Profile Using GloablId
			this.getBasicProfileUsingGloablId = function(jsonPara){
				var deferred = $q.defer();
				$http({
					method  : 'POST',
					url     : 'http://localhost:1337/api/getBasicProfileUsingGloablId',
					headers: {
	        			"Content-Type": "application/json"
	 				},
					params  : jsonPara, 
					
				}).success(function(response, status, headers, config) {
	                        deferred.resolve(response);
							
	            }).error(function(response, status, headers, config) {
							deferred.reject(response);
							$log.error(response, status);

				});
				return deferred.promise;
			};
			//IfRejectionThenSet
			this.IfRejectionThenSet = function(jsonPara){
				var deferred = $q.defer();
				$http({
					method  : 'POST',
					url     : 'http://localhost:1337/api/IfRejectionThenSet',
					headers: {
	        			"Content-Type": "application/json"
	 				},
					params  : jsonPara, 
					
				}).success(function(response, status, headers, config) {
	                        deferred.resolve(response);
							
	            }).error(function(response, status, headers, config) {
							deferred.reject(response);
							$log.error(response, status);

				});
				return deferred.promise;
			};

			//IsMailSentStatus
			this.IsMailSentStatus = function(jsonPara){
				var deferred = $q.defer();
				$http({
					method  : 'POST',
					url     : 'http://localhost:1337/api/IsMailSentStatus',
					headers: {
	        			"Content-Type": "application/json"
	 				},
					params  : jsonPara, 
					
				}).success(function(response, status, headers, config) {
	                        deferred.resolve(response);
							
	            }).error(function(response, status, headers, config) {
							deferred.reject(response);
							$log.error(response, status);

				});
				return deferred.promise;
			};
			//OnRejectChangeIsMailSent
			this.OnRejectChangeIsMailSent = function(jsonPara){
				var deferred = $q.defer();
				$http({
					method  : 'POST',
					url     : 'http://localhost:1337/api/OnRejectChangeIsMailSent',
					headers: {
	        			"Content-Type": "application/json"
	 				},
					params  : jsonPara, 
					
				}).success(function(response, status, headers, config) {
	                        deferred.resolve(response);
							
	            }).error(function(response, status, headers, config) {
							deferred.reject(response);
							$log.error(response, status);

				});
				return deferred.promise;
			};



 });