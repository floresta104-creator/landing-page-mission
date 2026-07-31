const fs = require('fs');
const path = 'C:/Users/Administrator/Desktop/orbiroomrand/src/play/PhotoGame.tsx';
const tmp = 'C:/Users/Administrator/Desktop/orbiroomrand/src/play/_laptop-inner.tmp.tsx';
let text = fs.readFileSync(path, 'utf8');
const neu = fs.readFileSync(tmp, 'utf8');
const start = text.indexOf('            {/* Night Desk OS');
const endMarker = '          <button type="button" className="back" onClick={backFromLaptop}>';
const end = text.indexOf(endMarker);
if (start < 0 || end < 0) {
  console.error('markers', start, end);
  process.exit(1);
}
// keep the closing pw-stage div just before the back button — find last </div> before endMarker in the old block
// Our neu already ends with lap-screen close. We need:
// neu + `          </div>\n` + back button...
// Old structure: lap-screen ... </div> </div> <button back>
// neu ends with </div> for lap-screen. Then we need </div> for pw-stage.
const out = text.slice(0, start) + neu + '\n          </div>\n' + text.slice(end);
fs.writeFileSync(path, out);
fs.unlinkSync(tmp);
fs.unlinkSync(__filename);
console.log('ok', start, end);
