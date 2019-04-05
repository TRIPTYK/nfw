import * as NodeUtil from "util"

const fullLog = (element) => console.log(NodeUtil.inspect(element, { showHidden: true, depth: null , colors : true }))

export { fullLog }
