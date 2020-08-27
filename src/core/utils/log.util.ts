import * as NodeUtil from "util"

const fullLog = (element) => console.log(NodeUtil.inspect(element, {showHidden: true, depth: null, colors: true}));
const shadowLog = (element) => console.log(NodeUtil.inspect(element, {showHidden: true, depth: 1, colors: true}));

export {fullLog, shadowLog}
