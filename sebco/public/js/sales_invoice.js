frappe.ui.form.on("Sales Invoice", {
  project: function(frm){
    frm.doc.items = [];
    var new_row = frm.add_child("items");
                new_row.item_code = "Supplying Man Power";
                new_row.item_name = "Supplying Man Power";
                new_row.description = "Supplying Man Power";
                new_row.conversion_factor = "1";
                new_row.uom = "Nos";
                new_row.rate = frm.doc.total_billing_amount;
                new_row.amount = 1;
                new_row.qty = 1;
                new_row.income_account = "Sales - SBCO";
              refresh_field("items");
              frm.trigger("qty");
	}
});
