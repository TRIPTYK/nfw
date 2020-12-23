/* eslint-disable no-console */
import * as NodeUtil from "util";

export const fullLog = (element) =>
    console.log(
        NodeUtil.inspect(element, {
            showHidden: true,
            depth: null,
            colors: true
        })
    );
export const shadowLog = (element) =>
    console.log(
        NodeUtil.inspect(element, { showHidden: true, depth: 1, colors: true })
    );
