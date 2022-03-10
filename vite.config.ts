import { defineConfig } from 'vite';
import path from "path";
import replace from '@rollup/plugin-replace';

export default defineConfig({
    root: path.resolve(__dirname, 'src/client'),
    build: {
        rollupOptions: {
            plugins: [
                //  Toggle the booleans here to enable / disable Phaser 3 features:
                replace({
                    'typeof CANVAS_RENDERER': "'true'",
                    'typeof WEBGL_RENDERER': "'true'",
                    'typeof EXPERIMENTAL': "'true'",
                    'typeof PLUGIN_CAMERA3D': "'false'",
                    'typeof PLUGIN_FBINSTANT': "'false'",
                    'typeof FEATURE_SOUND': "'true'"
                })
            ]
        }
    }
});