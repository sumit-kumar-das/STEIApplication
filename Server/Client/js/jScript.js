/*
 * Jquery Intilization
 * @author Sumit K
 */
 var optionss = [];
 $(document).ready(function(){
 	    $('.dropdown-menu a').on('click', function (event) {

        var $target = $(event.currentTarget),
          val = $target.attr('data-value'),
           $inp = $target.find('input'),
            idx;

        if ((idx = optionss.indexOf(val)) > -1) {
            optionss.splice(idx, 1);
            setTimeout(function () { $inp.prop('checked', false) }, 0);
      } else {
            optionss = [];
            optionss.push(val);
            setTimeout(function () { $inp.prop('checked', true) }, 0);
        }

        $(event.target).blur();

    //    console.log(optionss);
 
       
       return false;
    });
	$("body").on("click",function()
{
	//$('.slideupMenu').css('display', 'none');
});



});

