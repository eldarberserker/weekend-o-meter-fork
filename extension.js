/* extension.js
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 2 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 * SPDX-License-Identifier: GPL-2.0-or-later
 */

/* exported init */
'use strict';

const St = imports.gi.St;
const Mainloop = imports.mainloop;
const GObject = imports.gi.GObject;
const Lang = imports.lang;
const Gio = imports.gi.Gio;
const Main = imports.ui.main;
const Panel = Main.panel;
const PanelMenu = imports.ui.panelMenu;
const Clutter=imports.gi.Clutter;

let WoM;
let extensionPath;

const IndicatorName = 'WeekEndOMeter'

const WeekEndOMeter = GObject.registerClass(
class WeekEndOMeter extends PanelMenu.Button {
    _init() {
        super._init(null, IndicatorName);
        this._box = new St.BoxLayout({ style_class: 'panel-status-button-box' });

        // gfx loading
		this._icons = new Array(8);
		for (var i=0; i<9; i++)
		{
			this._icons[i] = Clutter.Texture.new_from_file(extensionPath+"/default/wom."+i+".png");
			this._icons[i].hide();
			this._box.insert_child_at_index(this._icons[i], i);
		}

		// display icon container
		this.actor.add_actor(this._box);
		Panel.addToStatusArea('wom', this);

		//first "timeout"
		this._on_timeout();
		// every hour...
		this._update_handler = Mainloop.timeout_add_seconds( 3600, Lang.bind(this, this._on_timeout));
    }

    _on_timeout() {

		//hide them all...
		for (var i=0; i<9; i++)
			this._icons[i].hide();

		// show the good one
		let now = new Date();
		let d = now.getDay();
		let h = now.getHours();

		if( d == 1 && h < 12 )
			this._icons[0].show();
		if( d == 1 && h >= 12 )
			this._icons[0].show();

		if( d == 2 && h < 12 )
			this._icons[1].show();
		if( d == 2 && h >= 12 )
			this._icons[2].show();

		if( d == 3 && h < 12 )
			this._icons[3].show();
		if( d == 3 && h >= 12 )
			this._icons[4].show();

		if( d == 4 && h < 12 )
			this._icons[5].show();
		if( d == 4 && h >= 12 )
			this._icons[6].show();

		if( d == 5 && h < 12 )
			this._icons[7].show();
		if( d == 5 && h >= 12 )
			this._icons[8].show();

		if( d == 6 && h < 12 )
			this._icons[4].show();
		if( d == 6 && h >= 12 )
			this._icons[3].show();

		if( d == 0 && h < 12 )
			this._icons[2].show();
		if( d == 0 && h >= 12 )
			this._icons[1].show();

		return true;
	}

    remove_timeout ( ) {
        if(this._update_handler) {
            Mainloop.source_remove(this._update_handler);
            this._update_handler=null;
         }
    }
}
);

function init(extensionMeta) 
{
    extensionPath = extensionMeta.path;
}
 
function enable()
{
    WoM = new WeekEndOMeter();
    Main.panel.addToStatusArea(IndicatorName, WoM);
}

function disable()
{
    WoM.remove_timeout();
    WoM.destroy();
    WoM = null;
}