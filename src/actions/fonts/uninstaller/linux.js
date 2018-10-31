import { localFontsDirPaths } from "../../../config";
import { removeUninstalledFontFromLocalCache } from "../_utils";

const sudo = window.require("sudo-prompt");

const linuxUninstaller = async (font, cb) => {
  const fontStyles = font.fontStyles || [];

  const filesNames = fontStyles.map(({ fontUrl }) => {
    const splittedUrl = fontUrl.split("/").reverse();
    return splittedUrl[0];
  });

  const filePaths = filesNames
    .map(fileName => {
      const localFontsDirPath = localFontsDirPaths.linux;
      return `${localFontsDirPath}/${fileName}`;
    })
    .join(" ");

  const options = { name: "fontlet", cachePassword: true };
  sudo.exec(`rm -rf ${filePaths}`, options, (error /* , stdout */) => {
    if (error) {
      cb(null, {
        ...font,
        installed: true,
        uninstalling: false,
        error: {
          message: `${font.familyName} uninstalling failed!.`,
          params: error
        }
      });
      return;
    }

    sudo.exec(`fc-cache -f -v`, options, () => {
      // if (fCacheError) {
      //   cb(fCacheError, null);
      //   return;
      // }

      // Update localCache
      removeUninstalledFontFromLocalCache(font, lcError => {
        if (lcError) {
          cb(null, {
            ...font,
            installed: true,
            uninstalling: false,
            error: lcError
          });
          return;
        }
        cb(null, {
          ...font,
          installed: false,
          uninstalling: false,
          error: null
        });
      });
    });
  });
};

export default linuxUninstaller;
