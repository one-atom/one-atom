import { Emitter } from '../miscellaneous_modules/emitter';

globalThis['__one_atom_debug_ref__'] ?? (globalThis['__one_atom_debug_ref__'] = new WeakSet());
globalThis['__one_atom_debug_hook__'] ?? (globalThis['__one_atom_debug_hook__'] = new Emitter());
