// Most code is identical to the regular login. This file contains only overrides.

Connection.main = function() {
	kinetic_script = null;
	error.style.display = 'none';
	login.style.display = 'none';
	videodiv.style.display = 'none';
	contents.style.display = 'none';
	question.style.display = 'none';
	speechbox.style.display = 'none';
	navigation.style.display = 'none';
	spritebox.style.display = 'none';
	sandbox.style.display = 'block';
	video.pause();
	for (var s in question.style)
		delete question.style[s];
	get_sandbox_list();
};

function get_sandbox_list() {
	server.call('sandbox_list', [], {}, function(file_list) {
		files = document.getElementById('files').ClearAll();
		for (var f = 0; f < file_list.length; ++f) {
			var file = file_list[f];
			var li = files.AddElement('li');
			var button = li.AddElement('button').AddText('Verwijderen').AddEvent('click', function() {
				server.call('sandbox_remove', [this.filename], {}, get_sandbox_list);
			});
			button.filename = file;
			button.type = 'button';
			li.AddText(file);
			if (file.substr(-7) == '.script') {
				button = li.AddElement('button').AddText('Laden').AddEvent('click', function() {
					var filename = this.filename;
					server.call('sandbox_get', [filename], {}, function(data) {
						document.getElementById('scriptname').value = filename.substr(0, filename.length - 7);
						document.getElementById('script').value = data;
					});
				});
				button.filename = file;
				button.type = 'button';
				button = li.AddElement('button').AddText('Spelen').AddEvent('click', function() {
					server.call('sandbox_play', [this.filename]);
				});
				button.filename = file;
				button.type = 'button';
			}
		}
	});
}

function put_script() {
	var name = document.getElementById('scriptname').value + '.script';
	var data = document.getElementById('script').value;
	server.call('sandbox_put', [name, data], {}, get_sandbox_list);
}