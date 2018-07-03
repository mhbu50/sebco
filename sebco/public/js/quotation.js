frappe.ui.form.on("Quotation", {
  refresh: function(frm) {
    $("div>ul>li>a:contains('Sales Order')").remove();
    $("div>ul>li>a:contains('Sales Order')").remove();
if (!frm.doc.__islocal && frm.doc.status !== "Lost" ) {
    frm.add_custom_button(__('Customer PO'), function() {
      frappe.route_options = {
        "agreement": frm.doc.agreement,
        "customer": frm.doc.customer
      };
      frappe.new_doc("Customer PO");
        }, __("Make"));
      }
    }
});
