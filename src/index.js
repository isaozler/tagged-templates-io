'use-strict'

function taggedTemplates(f, v, c) {
  const clean = (string) => string.toLowerCase().trim();

  const checkBool = (cVal) => clean(`${cVal}`) === 'false' || clean(`${cVal}`) === 'true';

  const process = (fn, data, condition) => {
    let parseData;
    if (!!Array.isArray(condition) && typeof fn === 'function') {
      if (!!Array.isArray(data) && data.length === condition.length) {
        data = data.reduce((acc, dataItem, index) => {
          let result = null;
          if (!!Array.isArray(dataItem) && checkBool(condition[index])) {
            const [tV, fV] = dataItem;
            result = JSON.parse(condition[index]) ? tV : fV;
          } else {
            result = dataItem;
          }
          return [
            ...acc,
            result,
          ];
        }, []);
      } else {
        data = data.reduce((acc, dataItem, index) => {
          let result = null;
          if (!!Array.isArray(condition)) {
            if (!!Array.isArray(dataItem)) {
              const [tV, fV] = dataItem;
              result = JSON.parse(condition[index]) ? tV : fV;
            } else {
              result = dataItem;
            }
          } else if (!Array.isArray(condition) && !!Array.isArray(dataItem)) {
            const [tV] = dataItem;
            result = tV;
          } else if (!Array.isArray(condition) && !Array.isArray(dataItem)) {
            result = dataItem;
          }
          return [
            ...acc,
            result,
          ];
        }, []);
      }
      const da = (sa) => fn.apply(this, sa);
      parseData = () => da(data);
    } else if (!!condition && typeof condition !== 'object') {
      // let result;
      if (!!Array.isArray(data)) {
        const [tV, fV] = [...data];
        if (checkBool(condition)) {
          data = JSON.parse(condition) ? tV : fV;
        } else {
          data = tV;
        }
      } else {
        data = [data];
      }
      parseData = () => ((sa) => fn.apply(this, [sa]))(data);
    } else if (!!Array.isArray(data) && typeof fn === 'function') {
      // let result;
      if (!!condition && checkBool(condition)) {
        const [tV, fV] = [...data];
        data = JSON.parse(condition) ? [tV] : [fV];
        parseData = () => ((sa) => fn.apply(this, sa))(data);
      } else {
        parseData = () => ((sa) => fn.apply(null, sa))(data);
      }

    } else if (typeof fn === 'function') {
      data = [data];
      parseData = () => ((sa) => {
        return fn.apply(this, [...sa]);
      })(data);
    } else if (!!data && (typeof data === 'string' || typeof data === 'number') && typeof fn === 'string' && !condition) {
      let callback;
      if (fn.match(/{(\d+)}/g)) {
        if (!!Array.isArray(data)) {
          callback = (_, m) => data[m];
        } else {
          callback = () => data;
        }
        parseData = () => fn.replace(/{(\d+)}/g, callback);
      } else if (fn.match(/{(\w+)}/g)) {
        parseData = (ddd) => {
          return Object.keys(ddd).reduce((accD, dkk) => {
            const strRegExPattern = `\\{${dkk}\\}`;
            const occ = fn.match(new RegExp(strRegExPattern, 'g'));
            if (!occ) return accD;
            return accD = occ.reduce((acc, matchString) => {
              const dK = matchString.slice(1, -1);
              return acc = acc.replace(matchString, ddd[dK]);
            }, accD);
          }, fn);
        };
      }
    } else if (!!condition && Array.isArray(condition)) {
      let callback;
      if (fn.match(/{(\d+)}/g)) {
        if (!!Array.isArray(data) && data.length === condition.length) {
          data = data.reduce((acc_mm, d, i) => {
            if (!!Array.isArray(d)) {
              const [tV, fV] = [...d];
              if (checkBool(condition[i])) {
                d = JSON.parse(condition[i]) ? tV : fV;
              } else {
                d = tV;
              }
            } else {
              d = [d];
            }
            return [
              ...acc_mm,
              d,
            ];
          }, []);
          callback = (_, m) => data[m];
        } else {
          callback = () => data;
        }
        parseData = () => fn.replace(/{(\d+)}/g, callback);
      }
    } else if (!!data && Array.isArray(data) && typeof fn === 'string' && !condition) {
      if (fn.match(/{(\d+)}/g)) {
        if (!!Array.isArray(data)) {
          callback = (_, m) => data[m];
        } else {
          callback = () => data;
        }
        parseData = () => fn.replace(/{(\d+)}/g, callback);
      }
    } else if (!!data && typeof data === 'object' && !!condition) {
      if (typeof condition === 'object') {
        parseData = (ddd) => {
          return Object.keys(ddd).reduce((accD, dkk) => {
            let aDk;
            const strRegExPattern = `\\{${dkk}\\}`;
            const occ = fn.match(new RegExp(strRegExPattern, 'g'));
            if (!occ) return accD;
            return accD = occ.reduce((acc, matchString) => {
              const dK = matchString.slice(1, -1);
              if (!!ddd[dK] && Array.isArray(ddd[dK]) && checkBool(condition[dK])) {
                const [tV, fV] = ddd[dK];
                aDk = JSON.parse(condition[dK]) ? [tV] : [fV];
              } else {
                if (!!ddd[dK] && Array.isArray(ddd[dK])) {
                  const [tV, fV] = ddd[dK];
                  if (typeof condition[dK] === 'number') {
                    aDk = ddd[dK][condition[dK]] || (!!condition[dK] ? tV : fV)
                  } else {
                    aDk = !!condition[dK] ? tV : fV;
                  }
                } else if (!!ddd[dK] || !isNaN(ddd[dK])) {
                  aDk = ddd[dK];
                }
              }
              return acc = acc.replace(matchString, aDk);
            }, accD);
          }, fn);
        };
      }
    } else if (!!data && typeof data === 'object' && !condition) {
      parseData = (ddd) => {
        return Object.keys(ddd).reduce((accD, dkk) => {
          const strRegExPattern = `\\{${dkk}\\}`;
          const occ = fn.match(new RegExp(strRegExPattern, 'g'));
          if (!occ) return accD;
          return accD = occ.reduce((acc, matchString) => {
            const dK = matchString.slice(1, -1);
            return acc = acc.replace(matchString, ddd[dK]);
          }, accD);
        }, fn);
      };
    }
    return parseData(data);
  };
  return process(f, v, c);
}

module.exports = taggedTemplates;
