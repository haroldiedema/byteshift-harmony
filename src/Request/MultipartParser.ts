
type Part = {
    header: string
    info: string
    part: number[]
}

type Input = {
    filename?: string
    name?: string
    type: string
    data: Buffer
}

export function parse(multipartBodyBuffer: Buffer, boundary: string): Input[]
{
    let lastline            = '';
    let header              = '';
    let info                = '';
    let state               = 0;
    let buffer: number[]    = [];
    const allParts: Input[] = [];

    for (let i = 0; i < multipartBodyBuffer.length; i++) {
        const oneByte: number          = multipartBodyBuffer[i];
        const prevByte: number | null  = i > 0 ? multipartBodyBuffer[i - 1] : null;
        const newLineDetected: boolean =
                  oneByte === 0x0a && prevByte === 0x0d ? true : false;
        const newLineChar: boolean     =
                  oneByte === 0x0a || oneByte === 0x0d ? true : false;

        if (!newLineChar) {
            lastline += String.fromCharCode(oneByte);
        }

        if (0 === state && newLineDetected) {
            if ('--' + boundary === lastline) {
                state = 1;
            }
            lastline = '';
        } else if (1 === state && newLineDetected) {
            header = lastline;
            state  = 2;
            if (header.indexOf('filename') === -1) {
                state = 3;
            }
            lastline = '';
        } else if (2 === state && newLineDetected) {
            info     = lastline;
            state    = 3;
            lastline = '';
        } else if (3 === state && newLineDetected) {
            state    = 4;
            buffer   = [];
            lastline = '';
        } else if (4 === state) {
            if (lastline.length > boundary.length + 4) {
                lastline = '';
            } // mem save
            if ('--' + boundary === lastline) {
                const j       = buffer.length - lastline.length;
                const part    = buffer.slice(0, j - 1);
                const p: Part = {header: header, info: info, part: part};

                allParts.push(process(p));
                buffer   = [];
                lastline = '';
                state    = 5;
                header   = '';
                info     = '';
            } else {
                buffer.push(oneByte);
            }
            if (newLineDetected) {
                lastline = '';
            }
        } else if (5 === state) {
            if (newLineDetected) {
                state = 1;
            }
        }
    }
    return allParts;
}

//  read the boundary from the content-type header sent by the http client
//  this value may be similar to:
//  'multipart/form-data; boundary=----WebKitFormBoundaryvm5A9tzU1ONaGP5B',
export function getBoundary(header: string): string
{
    const items = header.split(';');

    if (items) {
        for (let i = 0; i < items.length; i++) {
            const item = String(items[i]).trim();
            if (item.indexOf('boundary') >= 0) {
                const k = item.split('=');
                return String(k[1]).trim();
            }
        }
    }

    return '';
}

function process(part: Part): Input
{
    // will transform this object:
    // { header: 'Content-Disposition: form-data; name="uploads[]"; filename="A.txt"',
    // info: 'Content-Type: text/plain',
    // part: 'AAAABBBB' }
    // into this one:
    // { filename: 'A.txt', type: 'text/plain', data: <Buffer 41 41 41 41 42 42 42 42> }
    const obj    = function(str: string) {
        const k = str.split('=');
        const a = k[0].trim();

        const b = JSON.parse(k[1].trim());
        const o = {};
        Object.defineProperty(o, a, {
            value:        b,
            writable:     true,
            enumerable:   true,
            configurable: true,
        });
        return o;
    };
    const header = part.header.split(';');

    const filenameData = header[2];
    let input          = {};

    if (filenameData) {
        input             = obj(filenameData);
        const contentType = part.info.split(':')[1].trim();
        Object.defineProperty(input, 'type', {
            value:        contentType,
            writable:     true,
            enumerable:   true,
            configurable: true,
        });
    }

    Object.defineProperty(input, 'name', {
        value:        header[1].split('=')[1].replace(/"/g, ''),
        writable:     true,
        enumerable:   true,
        configurable: true,
    });

    Object.defineProperty(input, 'data', {
        value:        Buffer.from(part.part),
        writable:     true,
        enumerable:   true,
        configurable: true
    })

    return input as Input
}
