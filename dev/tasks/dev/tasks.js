/**
 * @license Copyright (c) 2003-2016, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

'use strict';

const gulp = require( 'gulp' );
const minimist = require( 'minimist' );
const statusTask = require( './tasks/status' );
const initTask = require( './tasks/init' );
const installTask = require( './tasks/install' );
const pluginCreateTask = require( './tasks/create-package' );
const updateTask = require( './tasks/update' );
const relinkTask = require( './tasks/relink' );

module.exports = ( config ) => {
	const ckeditor5Path = process.cwd();
	const packageJSON = require( '../../../package.json' );

	gulp.task( 'init', () => {
		initTask( installTask, ckeditor5Path, packageJSON, config.WORKSPACE_DIR, console.log );
	} );

	gulp.task( 'create-package', ( done ) => {
		pluginCreateTask( ckeditor5Path, config.WORKSPACE_DIR, console.log )
			.then( done )
			.catch( ( error )  => done( error ) );
	} );

	gulp.task( 'update', () => {
		const options = minimist( process.argv.slice( 2 ), {
			boolean: [ 'npm-update' ],
			default: {
				'npm-update': false
			}
		} );

		updateTask( ckeditor5Path, packageJSON, config.WORKSPACE_DIR, console.log, options[ 'npm-update' ] );
	} );

	gulp.task( 'status', () => {
		statusTask( ckeditor5Path, packageJSON, config.WORKSPACE_DIR, console.log, console.error );
	} );

	gulp.task( 'relink', () => {
		relinkTask( ckeditor5Path, packageJSON, config.WORKSPACE_DIR, console.log, console.error );
	} );

	gulp.task( 'install', () => {
		const options = minimist( process.argv.slice( 2 ), {
			string: [ 'package' ],
			default: {
				plugin: ''
			}
		} );

		if ( options.package ) {
			installTask( ckeditor5Path, config.WORKSPACE_DIR, options.package, console.log );
		} else {
			throw new Error( 'Please provide a package to install: gulp dev-install --plugin <path|GitHub URL|name>' );
		}
	} );
};
