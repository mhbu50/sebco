frappe.ui.form.on("Sales Order", {
	onload: function(frm) {
    console.log("in Sales Order");
    if(frm.doc.items && frm.doc.__islocal){
      $.each(frm.doc.items, function(index, value) {
          var new_row = frm.add_child("activity_type");
          new_row.activity_type = value.item_name;
          new_row.billing_rate = value.rate;
      });
      refresh_field("activity_type");
    }

	}
});
