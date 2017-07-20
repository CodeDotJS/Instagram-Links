#!/usr/bin/env node

'use strict';

const dns = require('dns');
const got = require('got');
const chalk = require('chalk');
const logUpdate = require('log-update');
const ora = require('ora');
const updateNotifier = require('update-notifier');
const pkg = require('./package.json');

updateNotifier({pkg}).notify();

const spinner = ora();
const arg = process.argv[2];
const inf = process.argv[3];

const pre = chalk.cyan.bold('›');
const pos = chalk.red.bold('›');

const col = args => {
	return chalk.dim(args);
};

if (!arg || arg === '-h' || arg === '--help') {
	console.log(`
 $ Usage: igl <command> [source]

 Commands:
 ${pre} -p, ${col('--profile')}  Get link of the profile picture in all resolution.
 ${pre} -i, ${col('--image')}    Get link of the publically shared images.
 ${pre} -v, ${col('--video')}    Get link of the publically shared videos.

 Help:
 ${pre} ${col('$')} igl -p ${col('[--profile]')} 9gag
 ${pre} ${col('$')} igl -i ${col('[--image]')}   https://www.instagram.com/p/BWtD8vxlCvO/
 ${pre} ${col('$')} igl -v ${col('[--video]')}   https://www.instagram.com/p/BWvEj0fF5Tg/
 `);
	process.exit(1);
}

if (!inf) {
	logUpdate(`\n${pos} ${col('Please provide a username or url!')}\n`);
	process.exit(1);
}

const checkConnection = () => {
	dns.lookup('instagram.com', err => {
		if (err) {
			logUpdate(`\n${pos} ${col('Please check your internet connection')}\n`);
			process.exit(1);
		} else {
			logUpdate();
			spinner.text = `Please wait`;
			spinner.start();
		}
	});
};

const showError = () => {
	logUpdate(`\n${pos} Error:\n\n ${pre} ${col('Invalid username')} or \n ${pre} ${col('URL is associated with Private Account')}\n`);
	process.exit(1);
};

if (arg === '-p' || arg === '--profile') {
	checkConnection();
	const url = `https://www.instagram.com/${inf}/?__a=1`;

	got(url, {json: true}).then(res => {
		logUpdate(`
${pre} Small resolution  : ${res.body.user.profile_pic_url}

${pre} Medium resolution : ${res.body.user.profile_pic_url_hd}

${pre} Full resolution   : ${res.body.user.profile_pic_url_hd.replace('/s320x320', '')}
		`);
		spinner.stop();
	}).catch(err => {
		if (err) {
			showError();
		}
	});
}

if (arg === '-i' || arg === '--image') {
	checkConnection();
	const url = inf.split('?')[0];

	got(`${url}?__a=1`, {json: true}).then(res => {
		logUpdate(`
${pre} Image's link : ${res.body.graphql.shortcode_media.display_url}
		`);
		spinner.stop();
	}).catch(err => {
		if (err) {
			showError();
		}
	});
}

if (arg === '-v' || arg === '--video') {
	checkConnection();
	const url = inf.split('?')[0];

	got(`${url}?__a=1`, {json: true}).then(res => {
		logUpdate(`
${pre} Video's link : ${res.body.graphql.shortcode_media.video_url}
		`);
		spinner.stop();
	}).catch(err => {
		if (err) {
			showError();
		}
	});
}
