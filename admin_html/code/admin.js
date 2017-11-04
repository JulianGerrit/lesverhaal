var groups, table, single;
var server_obj, server;

var ids = ['login', 'groups', 'table', 'single'];

function show(which) {
	for (var i = 0; i < ids.length; ++i)
		document.getElementById(ids[i]).style.display = (ids[i] == which ? 'block' : 'none');
}

function init() {
	groups = document.getElementById('groups');
	table = document.getElementById('table');
	single = document.getElementById('single');
	show(null);
	server_obj = Rpc(Connection);
	server = server_obj.proxy;
}
window.AddEvent('load', init);

var Connection = {
	replaced: function() {
		alert('De verbinding is overgenomen door een nieuwe login');
		init();
	},
	login: function() {
		// Show the login screen.
		show('login');
	},
	group_list: function(list) {
		// Show the list of groups, with the available sections for each group.
		show('groups');
		groups.ClearAll();
		console.info('groups:', list);
		for (var g = 0; g < list.length; ++g) {
			var group = list[g];
			var div = groups.AddElement('div');
			div.AddElement('b').AddText(group[0] + ': ');
			for (var s = 1; s < group.length; ++s) {
				var a = div.AddElement('a').AddText(group[s][0] + ' (' + group[s][1] + ')').AddEvent('click', function() {
					server.show_section(this.group, this.section);
				});
				a.group = group[0];
				a.section = group[s][0];
			}
		}
	},
	students_list: function(group, questions, students) {
		// Show students with questions in a table.
		show('table');
		table.ClearAll();
		var tr = table.AddElement('tr');
		tr.AddElement('th').AddText(group);
		for (var q = 0; q < questions.length; ++q)
			tr.AddElement('th').AddText(questions[q][1]);
		console.info('students:', students);
		var parse = function(ans) {
			return ans.length == 2 ? String(ans[0]).replace('.', ',') + ' ' + ans[1] : ans;
		};
		for (var s = 0; s < students.length; ++s) {
			tr = table.AddElement('tr');
			tr.AddElement('th').AddText(students[s][0]).style.color = students[s][1] ? '' : students[s][1] !== null ? 'blue' : 'grey';
			for (var q = 2; q < students[s].length; ++q) {
				var td = tr.AddElement('td');
				var answers = students[s][q][1];
				if (answers !== null && answers.length != 0) {
					td.AddText(parse(answers[0]));
					if (answers.length > 1) {
						td.AddElement('br');
						td.AddText(answers.length + ':' + parse(answers[answers.length - 1]));
					}
				}
				td.style.background = (students[s][q][0] ? 'green' : '');
			}
		}
	},
	student_detail: function(group, student, questions, detail) {
		// Show detailed progress for a single student.
		show('single');
		single.ClearAll();
		// TODO: show student details.
	},
};

function log_in() {
	var name = document.getElementById('name').value;
	var password = document.getElementById('password').value;
	server.login(name, password);
	return false;
}
