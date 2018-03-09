var express = require('express');
var fs = require('fs');
var app = express();
var bodyParser = require('body-parser');
var request = require('request');
var fileExists = require('file-exists');
var nodemailer = require('nodemailer');
var tp = require('tedious-promises');
var TYPES = require('tedious').TYPES;
var Connection = require('tedious').Connection;
var ConnectionPool = require('tedious-connection-pool');
var Request = require('tedious').Request;
var Client = require('node-rest-client').Client;
var client = new Client();

var poolConfig = {
    min: 2,
    max: 4,
    log: true
};

var connectionConfig = {  
        /* userName: 'STEIApp',  
        password: 'Maity@1234',  
        server: 'M2317207',
        database: 'STEITool',
        port: '61490',
        dialect: "mssql",
        dialectOptions: {
        instanceName: "JCISQLDATA" */

/* 	Visahl Azure login	   */
		/* userName: 'jcihtmltool',  
        password: 'T02FSxxXXc27Ck',  
        server: 'htmltool-sql.database.windows.net',
        database: 'htmltool-db',
        port: '1433',
        dialect: "mssql",
		//encrypt: true,
        dialectOptions: {
        instanceName: "htmltool-sql.database.windows.net"
        },
        
        options: {encrypt: true, database: 'htmltool-db'}   */
		
		
		/* Joshant free trial -azure account*/
		
		/* userName: 'joshantj',  
        password: 'Josh@j143',  
        server: 'stei-server.database.windows.net',
        database: 'STEITool',
        port: '1433',
        dialect: "mssql",
		dialectOptions: {
        instanceName: "stei-server.database.windows.net"
        },
          
        options: {encrypt: true, database: 'STEITool'} */ 
		
		/* Sheha free trial -azure account*/
		
		/* userName: 'joshantj',  
        password: 'josh@j143',  
        server: 'stei.database.windows.net',
        database: 'STEITool',
        port: '1433',
        dialect: "mssql",
		dialectOptions: {
        instanceName: "stei.database.windows.net"
        }, */
		
		/* Sumit free trial -azure account*/
		
		userName: 'STEIAdmin',  
        password: 'stei@admin123',  
        server: 'steiadmin.database.windows.net',
        database: 'STEITool',
        port: '1433',
        dialect: "mssql",
		//encrypt: true,
        dialectOptions: {
        instanceName: "steiadmin.database.windows.net"
        },
        // If you are on Azure SQL Database, you need these next options.  
        options: {encrypt: true, database: 'STEITool'}
		
};
//create the pool
var pool = new ConnectionPool(poolConfig, connectionConfig);
tp.setConnectionPool(pool); 
//Configure app to use bodyParser();
app.use(bodyParser.urlencoded({ extend: true}));
app.use(bodyParser.json({ extend: true}));

var port = process.env.PORT || 1337;

//Creating mailing Transport
var transporter = nodemailer.createTransport({
  service: 'gmail',
  port:485,
  auth: {
    user: 'stei.roadmap@gmail.com',
    pass: 'joshantsumit'
  }
});


// Rest Client Test 
//Routes for the API
var router = express.Router();
router.use(function(req, res, next) {
	console.log("Got Request"); // -> Something is happening
	next();
})
app.use(express.static('Client'));
// User Authentication through JCI Login API
router.route('/authenticateUser').post(function(req,res){
  var userName = req.query.username;
  var password = req.query.password;
  client.get("http://m2347992:8099/api/adservice/validateUserParam?username="+userName+"&password="+password, function (response, bodyData) {
    if(response){
      res.json({"status":"1","message" : 'Valid' });
    }else{
      res.json({"status":"0","message" : 'Invalid' });
    }
  });
})
// User Basic Profile through JCI API
router.route('/getBasicProfileUsingGloablId').post(function(req,res){
  var globalId = req.query.globalID;
  client.get("http://m2347992:8099/api/adservice/GetActiveDirectorySingleUserList?username="+globalId, function (response, bodyData) {
    console.log(response);
    if(JSON.parse(response).UserName){
      res.json({ "status":1,"data":JSON.parse(response) });  
    }else{
      res.json({"status":"0","message" : 'Invalid GlobalId' });
    }

  });
})

//Mailing API
router.route('/sendWeeklyMail').post(function(req,res){
	var resParams = req.query;
  var mailOptions = {
  from: resParams.from,
  to: resParams.to,
  subject: resParams.subject,
  html: resParams.html
};
var UserId = JSON.parse(resParams.data).UserId;
    var WeekId = JSON.parse(resParams.data).WeekId;
    var CompletionDate = JSON.parse(resParams.data).CompletionDate;
    var IsMailSent = JSON.parse(resParams.data).IsMailSent;
    var IsApproved = JSON.parse(resParams.data).IsApproved;
    var Status = JSON.parse(resParams.data).Status;

  tp.sql("Select * From TaskCompletion Where UserID = @UserId AND WeekID = @WeekId;")
  .parameter('UserId',TYPES.Int,UserId)
  .parameter('WeekId',TYPES.Int,WeekId)
  .execute()
  .then(function(results) {
    if(results.length>0){
        tp.sql("Update TaskCompletion SET IsMailSent = 1 Where WeekId = @WeekId AND UserID = @UserId;")
            .parameter('WeekId',TYPES.Int,WeekId)
            .parameter('UserId',TYPES.Int,UserId)
            .execute()
            .then(function(results) {
              res.json({ status: '1',message:'Updated IsMailSent Successfully On Submit'});
            }).fail(function(err) {
              console.log(err);
              res.json({ status: '0',message:'Updation IsMailSent Issues On Submit'});
            });

    }else{
      var connection = new Connection(connectionConfig);
        connection.on('connect', function(err){
          
        var request = new Request("INSERT INTO TaskCompletion (UserID,WeekId,CompletionDate,IsMailSent,IsApproved,Status) VALUES (@UserId,@WeekId,@CompletionDate,@IsMailSent,@IsApproved,@Status);",
        function(err){
          if(err){
            console.log(err);
          };
        });
        request.addParameter('UserId',TYPES.Int,UserId);
        request.addParameter('WeekId',TYPES.Int,WeekId);
        request.addParameter('CompletionDate',TYPES.Date,CompletionDate);
        request.addParameter('IsMailSent',TYPES.VarChar,IsMailSent);
        request.addParameter('IsApproved',TYPES.VarChar,IsApproved);
        request.addParameter('Status',TYPES.VarChar,Status);
    
        connection.execSql(request);
      });
      res.json({"status":"1","message" : 'Inserted Successfully' });
    }
  }).fail(function(err) {
    console.log(err);
    res.json({ status: '0'})
  });


//Mail Sending
//transporter.sendMail(mailOptions, function(error, info){
  //if (error) {
   // console.log(error);
  //  res.json({"status":"0","message" : 'Fail' });
 // } else {

 // } 
//});


})
/* 
 * Send Email on Approval and on Rejection
 */
router.route('/sendApprovalRejectionMail').post(function(req,res){
  var resParams = req.query;
  var mailOptions = {
  from: resParams.from,
  to: resParams.to,
  subject: resParams.subject,
  html: resParams.html
};

transporter.sendMail(mailOptions, function(error, info){
  if (error) {
    res.json({"status":"0","message" : 'Fail' });
  } else {
    res.json({"status":"1","message" : 'Mail Sent Successfully' });
  }
});
})
 /* End Email Code */
router.route('/getData').post(function(req, res) {
	//var fileName = req.query.fileName;
	//fs.readFile('./Client/data/files/'+fileName+'.json', function(err, data) {
   // res.writeHead(200, {'Content-Type': 'application/json'});
    //res.json(data);
    //res.end();
  //});
  var UserId = req.query.UserId;
  tp.sql("Select TS.TaskJSON FROM TaskSheet TS Where TS.UserID = @UserId;")
  .parameter('UserId',TYPES.Int,UserId)
  .execute()
  .then(function(results) {
    if(results){
      res.json(JSON.parse(results[0].TaskJSON));
    }
   
  }).fail(function(err) {
    console.log(err);
    res.json({ status: '0'})

  });
});
//Custom URL e.g. example.com:1337/api/ECHO

router.route('/:		').get(function(req, res) {

	res.json({echo: req.params.echo});
})
router.route('/checkUserExist').post(function(req, res){

  var GlobalID = req.query.globalID;
  console.log(GlobalID);
  tp.sql("Select * FROM Users Where GlobalID = @GlobalID;")
  .parameter('GlobalID',TYPES.VarChar,GlobalID)
  .execute()
  .then(function(results) {
    //console.log(results);
    if(results.length != 0){
      res.json({"status":"1","message" : 'File Exist',"response":results});
    }else{
      res.json({"status":"0","message" : 'File Not Exist' });
    }
   
  }).fail(function(err) {
    console.log(err);
    res.json({ status: '0'})

  });


});
/*
 * Store Data In Users Table  
 * Assign Empty JSON To New User 
 * Store Empty TaskJSON  into TaskSheet Table
 */
router.route('/createUserEntryInUsers').post(function(req, res) {
  var GlobalId = req.query.GlobalId;
  var FirstName = req.query.FirstName;
  var MiddleName = req.query.MiddleName;
  var LastName = req.query.LastName;
  var Designation = req.query.Designation;
  var Email = req.query.Email;
  var ManagerId = req.query.ManagerId;
  // Store Data In Users Table
 var connection = new Connection(connectionConfig);
        connection.on('connect', function(err){
        var request = new Request("INSERT INTO Users (GlobalID,FirstName,MiddleName,LastName,Designation,Email,ManagerId) VALUES (@GlobalId,@FirstName,@MiddleName,@LastName,@Designation,@Email,@ManagerId)",
        function(err){
          if(err){
            console.log(err);
          }else{
            res.json({ status: '1',message:'User Added Successfully'});
          };
        });
        request.addParameter('GlobalId',TYPES.VarChar,GlobalId);
        request.addParameter('FirstName',TYPES.VarChar,FirstName);
        request.addParameter('MiddleName',TYPES.VarChar,MiddleName);
        request.addParameter('LastName',TYPES.VarChar,LastName);
        request.addParameter('Designation',TYPES.VarChar,Designation);
        request.addParameter('Email',TYPES.VarChar,Email);
        request.addParameter('ManagerId',TYPES.VarChar,ManagerId);
    
        connection.execSql(request);
      });
});
 // Storing data in Tasksheet Table
router.route('/createUserTaskInTasksheet').post(function(req, res) {
  var UserId = req.query.UserId;
  var TaskJSON = req.query.TaskJSON;
  var Status = req.query.Status;
 var connection = new Connection(connectionConfig);
        connection.on('connect', function(err){
         // Storing data in Tasksheet Table
        var request = new Request("INSERT INTO Tasksheet (UserID,TaskJSON,Status) VALUES (@UserID,@TaskJSON,@Status)",
        function(err){
          if(err){
            console.log(err);
          }else{
            res.json({ status: '1',message:'Tasks Added Successfully'});
          };
        });
        request.addParameter('UserId',TYPES.Int,UserId);
        request.addParameter('TaskJSON',TYPES.VarChar,TaskJSON);
        request.addParameter('Status',TYPES.VarChar,Status);
        connection.execSql(request);
      });

});

/* --End of Code for New User Register (Employee - Manager Both)-- */

router.route('/saveDetails').post(function(req, res) {
  var UserId = req.query.UserId;
  var TaskJSON = req.query.TaskJSON;

  tp.sql("Update TaskSheet SET TaskJSON = @TaskJSON WHERE UserID = @UserId;")
            .parameter('UserId',TYPES.Int,UserId)
            .parameter('TaskJSON',TYPES.VarChar,TaskJSON)
            .execute()
            .then(function(results) {
              res.json({ status: '1',message:'Updated Successfully'});
            }).fail(function(err) {
              console.log(err);
              res.json({ status: '0',message:'Updation Issues'});
  });
});
router.route('/deleteDetails').delete(function(req, res) {

	res.json({ status: 'Date Deleted Successfully !'});
})
/*
 * Get Data For Manager's Dashboard
 */
router.route('/getManagerDashboard').post(function(req, res) {

  var globalId = req.query.globalId;
  //console.log("Manager Id==="+globalId);
  tp.sql("Select ROW_NUMBER() Over (Order by TC.UserID) As [SrNo], CONCAT(U.FirstName,' ' +U.MiddleName,' ' +U.LastName) As Name,TC.WeekId,TC.CompletionDate,U.GlobalID,U.UserID,TC.Status From Users U Right OUTER JOIN TaskCompletion TC on U.UserID =TC.UserID WHERE (U.ManagerId = @GlobalId) AND ( TC.IsMailSent = 1 OR TC.IsMailSent = 0 );")
  .parameter('GlobalId',TYPES.VarChar,globalId)
  .execute()
  .then(function(results) {
    res.json({ status: '1',data:results })
  }).fail(function(err) {
    res.json({ status: '0'})
  });
})
/*
 * Get View Week Data's Dashboard
 */
router.route('/viewWeeklyTaskManager').post(function(req, res) {

  var UserId = req.query.UserId;
  var weekId = req.query.WeekId;
  tp.sql("Select TS.TaskJSON FROM TaskSheet TS Where TS.UserID = @UserId;")
  .parameter('UserId',TYPES.Int,UserId)
  .execute()
  .then(function(results) {
    if(results){
      if(weekId == 1){
      res.json(JSON.parse(results[0].TaskJSON).week_1);
      }else if(weekId == 2){
       res.json(JSON.parse(results[0].TaskJSON).week_2);
      }else if(weekId == 3){
       res.json(JSON.parse(results[0].TaskJSON).week_3);
      }else if(weekId == 4){
       res.json(JSON.parse(results[0].TaskJSON).week_4);
      }
    }
   
  }).fail(function(err) {
    console.log(err);
    res.json({ status: '0'})

  });
})
/*
 * Approve Reject Weekly Task Individually.
 */
router.route('/setApproveReject').post(function(req, res) {
  var IsTaskApproved = req.query.IsTaskApproved;
  var UserId = req.query.UserId;
  var WeekId = req.query.WeekId;
  var TaskId = req.query.TaskId;

  //console.log(IsTaskApproved);
  var ComentedDate = req.query.ComentedDate;
  var CommentedFor = req.query.CommentedFor;
  var CommentedText = req.query.CommentedText;
  var Status = req.query.Status;
  var SubTaskID = req.query.SubTaskID;
   
  
  //tp.sql("Select *  FROM UserComments UC WHERE UC.UserID = @UserId AND UC.CommentedFor = @CommentedFor AND UC.WeekId = @WeekId AND TaskID = @TaskId;")
  //.parameter('UserId',TYPES.Int,UserId)
  //.parameter('WeekId',TYPES.Int,WeekId)
  //.parameter('TaskId',TYPES.Int,TaskId)
  //.parameter('CommentedFor',TYPES.VarChar,CommentedFor)
  //.execute()
  //.then(function(results) {
   // console.log(results);
   
   // var length = results.length;
   // console.log("Length of the stat : "+length);
   // if(results){
          //tp.sql("Update UserComments SET IsTaskApproved = @IsTaskApproved WHERE UserID = @UserId AND WeekId = @WeekId AND TaskID = @TaskID;")
            //.parameter('IsTaskApproved',TYPES.Bit,IsTaskApproved)
            //.parameter('UserId',TYPES.Int,UserId)
            //.parameter('WeekId',TYPES.Int,WeekId)
            //.parameter('TaskId',TYPES.Int,TaskId)
            //.execute()
            //.then(function(results) {
             // res.json({ status: '1',message:'Updated Successfully'});
            //}).fail(function(err) {
             // res.json({ status: '0',message:'Updation Issues'});
           // });
    //}else{
        var connection = new Connection(connectionConfig);
        connection.on('connect', function(err){
          //console.log("Please say"+IsTaskApproved);
        var request = new Request("INSERT INTO UserComments (UserID,WeekId,TaskID,IsTaskApproved,ComentedDate,CommentedFor,CommentedText,Status,SubTaskID) VALUES (@UserId,@WeekId,@TaskId,@IsTaskApproved,@ComentedDate,@CommentedFor,@CommentedText,@Status,@SubTaskID);",
        function(err){
          if(err){
            console.log(err);
          }else{
            res.json({ status: '1',message:'Comment Approval Rejection Added Successfully'});
          };
        });
        request.addParameter('UserId',TYPES.Int,UserId);
        request.addParameter('WeekId',TYPES.Int,WeekId);
        request.addParameter('TaskId',TYPES.Int,TaskId);
        request.addParameter('IsTaskApproved',TYPES.VarChar,IsTaskApproved);
        request.addParameter('ComentedDate',TYPES.Date,ComentedDate);
        request.addParameter('CommentedFor',TYPES.VarChar,CommentedFor);
        request.addParameter('CommentedText',TYPES.VarChar,CommentedText);
        request.addParameter('Status',TYPES.VarChar,Status);
        request.addParameter('SubTaskID',TYPES.VarChar,SubTaskID);
    
        connection.execSql(request);
      });

        
    //}
  //}).fail(function(err) {
   // console.log(err);
   // res.json({ status: '0',message:'Somthing Went wrong While Selecting data from UserComments Table'});
  //});


})
/*
 * Get Weekly Whole Week Approved or Not
 */


 /*
  * Get Week Particular Task Approved or Not
  */
  router.route('/getParticularTaskApprovalStatus').post(function(req, res) {

  var UserId = req.query.UserId;
  var WeekId = req.query.WeekId;
  var CommentedFor = req.query.CommentedFor;
  tp.sql("SElECT UC.IsTaskApproved,UC.TaskID from UserComments UC Where UC.CommentedFor = @UserId AND UC.WeekId = @WeekId;")
  .parameter('UserId',TYPES.Int,UserId)
  .parameter('WeekId',TYPES.Int,WeekId)
  .execute()
  .then(function(results) {
    if(results){
      res.json(results);
    }
  }).fail(function(err) {
    res.json({ status: '0'})
  });
})
/*
 *Get Particular Task's comments list
 */
   router.route('/getParticularTaskComments').post(function(req, res) {

  var UserId = req.query.CommentedFor;
  var WeekId = req.query.WeekId;
  var CommentedFor = req.query.UserId;
  var EmployeesComments = [];
  tp.sql("SElECT UC.CommentedFor,UC.ComentedDate,UC.UserID,UC.IsTaskApproved,UC.TaskID,UC.CommentedText from UserComments UC Where UC.CommentedFor = @CommentedFor AND UC.UserID = @UserId AND UC.WeekId = @WeekId;")
  .parameter('UserId',TYPES.Int,UserId)
  .parameter('WeekId',TYPES.Int,WeekId)
  .parameter('CommentedFor',TYPES.Int,CommentedFor)
  .execute()
  .then(function(results) {
    if(results){
      //res.json(results);
      EmployeesComments = results;
    }
  }).fail(function(err) {
    console.log(err);
    res.json({ status: '0'})
  });

  var UserId = req.query.UserId;
  var WeekId = req.query.WeekId;
  var CommentedFor = req.query.CommentedFor;
  tp.sql("SElECT UC.CommentedFor,UC.ComentedDate,UC.UserID,UC.IsTaskApproved,UC.TaskID,UC.CommentedText from UserComments UC Where UC.CommentedFor = @CommentedFor AND UC.UserID = @UserId AND UC.WeekId = @WeekId;")
  .parameter('UserId',TYPES.Int,UserId)
  .parameter('WeekId',TYPES.Int,WeekId)
  .parameter('CommentedFor',TYPES.Int,CommentedFor)
  .execute()
  .then(function(results) {
    if(results){
      res.json(EmployeesComments.concat(results));
    }
  }).fail(function(err) {
    console.log(err);
    res.json({ status: '0'})
  });
})
/*
 *
 */
router.route('/getBasicUserInfo').post(function(req, res) {

  var UserId = req.query.UserId;
  tp.sql("SElECT CONCAT(' ' +FirstName,' ' +MiddleName,' ' +LastName) As Name from Users Where UserID = @UserId;")
  .parameter('UserId',TYPES.Int,UserId)
  .execute()
  .then(function(results) {
    if(results){
      res.json(results);
    }
  }).fail(function(err) {
    res.json({ status: '0'})
  });
})

/*
 * Get Weekly IsMailSent Status
 */
router.route('/IsMailSentStatus').post(function(req, res) {

  var UserId = req.query.UserId;
  var WeekId = req.query.WeekId;
  tp.sql("SElECT IsMailSent from TaskCompletion Where UserID = @UserId AND WeekId = @WeekId;")
  .parameter('UserId',TYPES.Int,UserId)
  .parameter('WeekId',TYPES.Int,WeekId)
  .execute()
  .then(function(results) {
    if(results){
      res.json(results);
    }
  }).fail(function(err) {
    res.json({ status: '0'})
  });
})

/*
 * Add Cooments
 */
router.route('/saveComents').post(function(req, res) {
    var IsTaskApproved = req.query.IsTaskApproved;
    var UserId = req.query.UserId;
    var WeekId = req.query.WeekId;
    var TaskId = req.query.TaskId;

    //console.log(IsTaskApproved);
    var ComentedDate = req.query.ComentedDate;
    var CommentedFor = req.query.CommentedFor;
    var CommentedText = req.query.CommentedText;
    var Status = req.query.Status;
    var connection = new Connection(connectionConfig);
        connection.on('connect', function(err){
          console.log("Please say"+IsTaskApproved);
        var request = new Request("INSERT INTO UserComments (UserID,WeekId,TaskID,IsTaskApproved,ComentedDate,CommentedFor,CommentedText,Status) VALUES (@UserId,@WeekId,@TaskId,@IsTaskApproved,@ComentedDate,@CommentedFor,@CommentedText,@Status);",
        function(err){
          if(err){
            console.log(err);
          }else{
            res.json({ status: '1',message:'Comment Added Successfully'});
          };
        });
        request.addParameter('UserId',TYPES.Int,UserId);
        request.addParameter('WeekId',TYPES.Int,WeekId);
        request.addParameter('TaskId',TYPES.Int,TaskId);
        request.addParameter('IsTaskApproved',TYPES.VarChar,IsTaskApproved);
        request.addParameter('ComentedDate',TYPES.Date,ComentedDate);
        request.addParameter('CommentedFor',TYPES.VarChar,CommentedFor);
        request.addParameter('CommentedText',TYPES.VarChar,CommentedText);
        request.addParameter('Status',TYPES.VarChar,Status);
    
        connection.execSql(request);
      });

})
/*
 *
 */
router.route('/getUserInfo').post(function(req, res) {

  var UserId = req.query.UserId;
  tp.sql("SElECT * from Users Where UserID = @UserId;")
  .parameter('UserId',TYPES.Int,UserId)
  .execute()
  .then(function(results) {
    if(results){
      res.json(results);
    }
  }).fail(function(err) {
    res.json({ status: '0'})
  });
})
/*
 * Get Employees JSON FILES DATA FOR Every User
 */
router.route('/getCompleteJSON').post(function(req, res) {

  var UserId = req.query.UserId;
  var weekId = req.query.WeekId;
  tp.sql("Select TS.TaskJSON FROM TaskSheet TS Where TS.UserID = @UserId;")
  .parameter('UserId',TYPES.Int,UserId)
  .execute()
  .then(function(results) {
    if(results){
      res.json(JSON.parse(results[0].TaskJSON));
    }
   
  }).fail(function(err) {
    res.json({ status: '0'})
  });
})
/*
 * SET Employees JSON FILES DATA INTO TaskSheet Table
 */
router.route('/setCompleteJSON').post(function(req, res) {

  var UserId = req.query.UserId;
  var TaskJSON = req.query.TaskJSON;
  tp.sql("Update TaskSheet SET TaskJSON = @TaskJSON WHERE UserID = @UserId;")
            .parameter('UserId',TYPES.Int,UserId)
            .parameter('TaskJSON',TYPES.VarChar,TaskJSON)
            .execute()
            .then(function(results) {
              res.json({ status: '1',message:'Updated Successfully'});
            }).fail(function(err) {
              console.log(err);
              res.json({ status: '0',message:'Updation Issues'});
          });
  })

/* 
 *SET If Rejection happened
 */
router.route('/IfRejectionThenSet').post(function(req, res) {

  var WeekId = req.query.WeekId;
  var TaskId = req.query.TaskId;
  var UserId = req.query.UserId;
  
  tp.sql("Select IsTaskApproved from UserComments Where WeekId = @WeekId AND TaskID = @TaskId AND CommentedFor = @UserId;")
  .parameter('WeekId',TYPES.Int,WeekId)
  .parameter('TaskId',TYPES.VarChar,TaskId)
  .parameter('UserId',TYPES.Int,UserId)
  .execute()
  .then(function(results) {
    console.log("Results : ");
    console.log(results);
    console.log("Length -- "+results.length);

    if(results.length > 0){
      tp.sql("Update UserComments SET IsTaskApproved = Null Where WeekId = @WeekId AND TaskID = @TaskId AND CommentedFor = @UserId;")
            .parameter('WeekId',TYPES.Int,WeekId)
            .parameter('TaskId',TYPES.VarChar,TaskId)
            .parameter('UserId',TYPES.Int,UserId)
            .execute()
            .then(function(results) {
              res.json({ status: '1',message:'Updation IfRejectionThenSet Successfully'});
            }).fail(function(err) {
              console.log(err);
              res.json({ status: '0',message:'Updation IfRejectionThenSet Issues'});
      });
    }else{
      res.json({ status: '1',message:'No data available'});
    }
  }).fail(function(err) {
    res.json({ status: '0',message :'Somthing Goes Wrong in IfRejectionThenSet'})
  });

});
/* 
 * On Rejection SET IsMailSent 0 in TaskCompletion Table
 */
router.route('/OnRejectChangeIsMailSent').post(function(req, res) { 
    var WeekId = req.query.WeekId;
    var UserId = req.query.UserId;

      tp.sql("Update TaskCompletion SET IsMailSent = 0 Where WeekId = @WeekId AND UserID = @UserId;")
                      .parameter('WeekId',TYPES.Int,WeekId)
                      .parameter('UserId',TYPES.Int,UserId)
                      .execute()
                      .then(function(results) {
                        res.json({ status: '1',message:'Updated IsMailSent On Rejection'});
                      }).fail(function(err) {
                        console.log(err);
                        res.json({ status: '0',message:'Updation IsMailSent Issues On Rejection'});
      });
});


 /*
  * Get New Notification
 */

/*
 * Get Index Page Rendered
 */
router.route('*').get(function(req, res) {
        res.sendfile('./Client/index.html'); // load the single view file (angular will handle the page changes on the front-end)
});

/*
 *All routes will be prefixed with /api
 */
app.use('/api', router);
app.use('/apis', router);


//Start the server
app.listen(port);
console.log('API server has been started on port ' + port);