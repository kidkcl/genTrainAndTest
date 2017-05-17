let lastid = 0;

export default function(prefix='uuid') {
    lastid++;
    return `${prefix}${lastid}`;
}