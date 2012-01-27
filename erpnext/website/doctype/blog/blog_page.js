// js inside blog page

pscript['onload_{{ doc.name }}'] = function(wrapper) {
	// sidebar
	var side = $(wrapper).find('.web-side-section')
		.append('<h4>Recent Posts</h4>').get(0);
		
	wrapper.recent_list = new wn.widgets.Listing({
		parent: side,
		query: 'select name, title, left(content, 100) as content from tabBlog\
			where ifnull(published,1)=1',
		hide_refresh: true,
		render_row: function(parent, data) {
			if(data.content.length==100) data.content += '...';
			parent.innerHTML = repl('<a href="#!%(name)s">%(title)s</a>\
				<div class="comment">%(content)s</div><br>', data);
		},
		page_length: 5
	});
	wrapper.recent_list.run();
	
	
	// comments
	$(wrapper).find('.web-main-section').append('<h3>Comments</h3>');

	wrapper.comment_list = new wn.widgets.Listing({
		parent: $(wrapper).find('.web-main-section').get(0),
		query: 'select comment, comment_by_fullname, comment_date\
			from `tabComment Widget Record` where comment_doctype="Page"\
			and comment_docname="{{ doc.name }}"',
		no_result_message: 'Be the first one to comment',
		render_row: function(parent, data) {
			data.comment_date = dateutil.str_to_user(data.comment_date);
			$(parent).html(repl("<div style='color:#777'>\
				On %(comment_date)s %(comment_by_fullname)s said:\
				</div>\
				<p style='margin-left: 20px;'>%(comment)s</p><br>", data))
		},
		hide_refresh: true
	});
	wrapper.comment_list.run();
	
	// add comment
	$(wrapper).find('.web-main-section').append('<br><button class="btn add-comment">\
		Add Comment</button>');
	$(wrapper).find('button.add-comment').click(function(){
		d = new wn.widgets.Dialog({
			title: 'Add Comment',
			fields: [
				{fieldname:'comment_by_fullname', label:'Your Name', reqd:1, fieldtype:'Data'},
				{fieldname:'comment_by', label:'Email Id', reqd:1, fieldtype:'Data'},
				{fieldname:'comment', label:'Comment', reqd:1, fieldtype:'Text'},
				{fieldname:'post', label:'Post', fieldtype:'Button'}
			]
		});
		d.fields_dict.post.input.onclick = function() {
			var btn = this;
			var args = d.get_values();
			if(!args) return;
			args.comment_doctype = 'Page';
			args.comment_docname = '{{ doc.name }}';
			$(btn).set_working();
			$c('webnotes.widgets.form.comments.add_comment', args, function(r) {
				$(btn).done_working();
				d.hide();
				wrapper.comment_list.refresh();
			})
		}
		d.show();
	})
}