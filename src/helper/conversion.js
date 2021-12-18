export function numberWithCommas(x) {
    // Source : https://stackoverflow.com/a/2901298
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// https://gist.github.com/SonyaMoisset/aa79f51d78b39639430661c03d9b1058#file-title-case-a-sentence-for-loop-wc-js
export function titleCase(str) {
  str = str.toLowerCase().split(' ');
  for (var i = 0; i < str.length; i++) {
    str[i] = str[i].charAt(0).toUpperCase() + str[i].slice(1); 
  }
  return str.join(' ');
}
