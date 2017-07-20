import childProcess from 'child_process';
import test from 'ava';

test.cb('regular', t => {
	const cp = childProcess.spawn('./cli.js', ['-h'], {stdio: 'inherit'});

	cp.on('error', t.ifError);

	cp.on('close', code => {
		t.is(code, 1);
		t.end();
	});
});

test.cb('username', t => {
	const cp = childProcess.spawn('./cli.js', ['-p', 'iama_rishi'], {stdio: 'inherit'});

	cp.on('error', t.ifError);

	cp.on('close', code => {
		t.is(code, 0);
		t.end();
	});
});

test.cb('images', t => {
	const cp = childProcess.spawn('./cli.js', ['-i', 'https://www.instagram.com/p/BWtD8vxlCvO/'], {stdio: 'inherit'});

	cp.on('error', t.ifError);

	cp.on('close', code => {
		t.is(code, 0);
		t.end();
	});
});

test.cb('vidoes', t => {
	const cp = childProcess.spawn('./cli.js', ['-v', 'https://www.instagram.com/p/BMyWqmqDF_W/?taken-by=iama_rishi'], {stdio: 'inherit'});

	cp.on('error', t.ifError);

	cp.on('close', code => {
		t.is(code, 0);
		t.end();
	});
});
