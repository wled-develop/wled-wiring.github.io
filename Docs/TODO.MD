## Component assets

- `miniOTOFuse` still references `./miniOTO_2A.jpg`, but the full front-view asset is missing from `public/`. Only `miniOTO_2A_top.jpg` exists, which is suitable for board overlays but not for the standalone fuse component. Add a correct `public/miniOTO_2A.jpg` asset or update the component when the real front-view asset is available.
