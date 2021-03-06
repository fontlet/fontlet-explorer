import { localFontsDirPaths, fontRegExecPath } from "../../../config";
import { runCmd } from "../../_utils";

const uninstall = async font => {
  try {
    const fontStyles = font.fontStyles || [];
    const filesNames = fontStyles.map(({ fontUrl }) => {
      const splittedUrl = fontUrl.split("/").reverse();
      return splittedUrl[0];
    });
    const filePaths = filesNames
      .map(fileName => {
        const localFontsDirPath = localFontsDirPaths.win;
        return `${localFontsDirPath}\\${fileName}`;
      })
      .join(" ");

    const cmd = `del /f /q ${filePaths} && ${fontRegExecPath}\\FontReg.exe`;
    await runCmd(cmd);
    return font;
  } catch (error) {
    throw new Error(error);
  }
};

export default uninstall;
