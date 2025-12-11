import St from 'gi://St';
import GLib from 'gi://GLib';
import * as Main from 'resource:///org/gnome/shell/ui/main.js';

export default class PoweroffButtonExtension {
    constructor(metadata) {
        this._metadata = metadata;
        this._icon = null;
        this._button = null;
    }

    enable() {
        this._icon = new St.Icon({
            icon_name: 'system-shutdown-symbolic',
            style_class: 'system-status-icon'
        });

        this._button = new St.Bin({
            style_class: 'panel-button',
            reactive: true,
            can_focus: true,
            track_hover: true
        });

        this._button.set_child(this._icon);
        this._button.connect('button-press-event', this._onButtonPress.bind(this));
        
        Main.panel._rightBox.insert_child_at_index(this._button, -1);
    }

    disable() {
        if (this._button && Main.panel._rightBox.contains(this._button)) {
            Main.panel._rightBox.remove_child(this._button);
        }
        
        if (this._icon) {
            this._icon.destroy();
            this._icon = null;
        }
        
        if (this._button) {
            this._button.destroy();
            this._button = null;
        }
    }

    _onButtonPress(actor, event) {
        GLib.spawn_command_line_async('gnome-session-quit --power-off');
        return true;
    }
}
