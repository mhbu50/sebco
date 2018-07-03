frappe.ui.form.on('Project', {
    refresh: function(frm) {
      dashboard_link_doctype(frm, "Quotation");
    }
  });


  var dashboard_link_doctype = function (frm, doctype){

    var parent = $('.form-dashboard-wrapper [data-doctype="Sales Order"]').closest('div').parent();

    parent.find('[data-doctype="'+doctype+'"]').remove();

    parent.append(frappe.render_template("dashboard_link_doctype", {doctype:doctype}));

    var self = parent.find('[data-doctype="'+doctype+'"]');

    set_open_count(frm, doctype);

    // bind links
    self.find(".badge-link").on('click', function() {
      frappe.route_options = {"quotation": frm.doc.name,"project": frm.doc.name}
      frappe.set_route("List", doctype);
    });

    // bind open notifications
    self.find('.open-notification').on('click', function() {
      frappe.route_options = {
        "quotation": frm.doc.name,
        "project": frm.doc.name,
        "status": "Draft"
      }
      frappe.set_route("List", doctype);
    });

    // bind new
    if(frappe.model.can_create(doctype)) {
      self.find('.btn-new').removeClass('hidden');
    }
    self.find('.btn-new').on('click', function() {
      frappe.new_doc(doctype,{
        "quotation": frm.doc.name,
        "project": frm.doc.name,
        "agreement": frm.doc.agreement,
        "customer": frm.doc.customer,

      });
    });
  }

  var set_open_count = function (frm, doctype){

    var method = '';
    var links = {};

    if(doctype=="Quotation"){
      method = 'sebco.sebco.tools.get_open_count';
      links = {
        'fieldname': 'project',
        'transactions': [
          {
            'label': __('Quotation'),
            'items': ['Quotation']
          },
        ]
      };
    }

    if(method!=""){
      frappe.call({
        type: "GET",
        method: method,
        args: {
          doctype: frm.doctype,
          name: frm.doc.name,
          links: links,
        },
        callback: function(r) {
          // update badges
          $.each(r.message.count, function(i, d) {
            frm.dashboard.set_badge_count(d.name, cint(d.open_count), cint(d.count));
          });
        }
      });
    }
  }

  frappe.templates["dashboard_link_doctype"] = ' \
    <div class="document-link" data-doctype="{{ doctype }}"> \
    <a class="badge-link small">{{ __(doctype) }}</a> \
    <span class="text-muted small count"></span> \
    <span class="open-notification hidden" title="{{ __("Open {0}", [__(doctype)])}}"></span> \
      <button class="btn btn-new btn-default btn-xs hidden" data-doctype="{{ doctype }}"> \
          <i class="octicon octicon-plus" style="font-size: 12px;"></i> \
      </button>\
    </div>';
