(function(window){
  window.extractData = function() {
    var ret = $.Deferred();

    function onError() {
      console.log('Loading error', arguments);
      ret.reject();
    }

    function onReady(smart)  {
      if (smart.hasOwnProperty('patient')) {
        var patient = smart.patient;
        var pt = patient.read();
        conds = smart.patient.api.search({type: "Condition"});
        $.when(pt,conds).fail(onError);

        $.when(pt,conds).done(function(c){
          console.log(c);
          c.data.entry.forEach(function(ce) {
            var cx = ce.resource;
            var row = $("<li> " + cx.code.text + "</li>");
            $("#condition_list").append(row);
            ret.resolve(c);
          });
        });
      } else {
        onError();
      }
    }

    FHIR.oauth2.ready(onReady, onError);
    return ret.promise();

  };

})(window);
