/**
 * @license Copyright (c) 2003-2024, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

'use strict';

/* eslint-env node */

import path from 'path';
import fs from 'fs';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath( import.meta.url );
const __dirname = path.dirname( __filename );

( async () => {
	// CKEditor 5.
	const husky = await import( 'husky' );

	husky.install();

	// External repositories.
	const EXTERNAL_DIR_PATH = path.resolve( __dirname, '..', 'external' );

	// Exit process when "external" directory is not created.
	if ( !fs.existsSync( EXTERNAL_DIR_PATH ) ) {
		process.exit( 0 );
	}

	// Otherwise, go through packages in "external" and run the `postinstall` script.
	fs.readdirSync( EXTERNAL_DIR_PATH )
		.map( relativePath => path.join( EXTERNAL_DIR_PATH, relativePath ) )
		// Filter out OS files, e.g., `.DS_Store`.
		.filter( externalRepository => fs.statSync( externalRepository ).isDirectory() )
		// Filter out repositories without the `postinstall` hook.
		.filter( externalRepository => {
			const pkgJson = require( path.join( externalRepository, 'package.json' ) );

			return pkgJson && pkgJson.scripts && pkgJson.scripts.postinstall;
		} )
		.forEach( externalRepository => {
			execSync( 'yarn run postinstall', {
				stdio: 'inherit',
				cwd: externalRepository
			} );
		} );
} )();
