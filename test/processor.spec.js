var Processor = require('../index');

function MockFile(options) {
    this.setData(options.data);
    this.relativePath = options.relativePath;
    this.fullPath = options.fullPath;
}

MockFile.prototype.setData = function (data) {
    this.data = data
};

function MockBuilder() {
    this.processFiles = [
        new MockFile({
            data: '1',
            fullPath: '/project/1.js',
            relativePath: '1.js'
        }),
        new MockFile({
            data: '2',
            fullPath: '/project/2.js',
            relativePath: '2.js'
        }),
        new MockFile({
            data: '3',
            fullPath: '/project/3.js',
            relativePath: '3.js'
        }),
        new MockFile({
            data: '4',
            fullPath: '/project/4.js',
            relativePath: '4.css'
        })
    ];
}

MockBuilder.prototype.getProcessFiles = function () {
    return this.processFiles;
};

describe("Processor Base", function () {

    it("merge options when constructor run", function () {
        var processor = new Processor({
            a: 1,
            b: '2'
        });

        expect(processor.a).toBe(1);
        expect(processor.b).toBe('2');
    });

    it("has default files option", function () {
        var processor = new Processor();

        expect(processor.files instanceof Array).toBeTruthy();
        expect(processor.files.length).toBe(0);
    });

    it("files option should be override by constructor options", function () {
        var processor = new Processor({
            files: ['**/*.js']
        });

        expect(processor.files instanceof Array).toBeTruthy();
        expect(processor.files.length).toBe(1);
    });

    it("files option should be override by constructor options", function () {
        var processor = new Processor({
            files: ['**/*.js']
        });

        expect(processor.files instanceof Array).toBeTruthy();
        expect(processor.files.length).toBe(1);
    });

    it("derive, override processFile, return Promise", function (done) {
        var CustomProcessor = Processor.derive({
            processFile: function (file) {
                return new Promise(function (resolve, reject) {
                    setTimeout(function () {
                        file.setData(file.data + 1);
                        resolve();
                    }, 1);
                });
            }
        });
        var processor = new CustomProcessor({
            files: ['**/*.js']
        });

        var builder = new MockBuilder();
        processor.process(builder).then(function () {
            var files = builder.getProcessFiles();
            expect(files[0].data).toBe('11');
            expect(files[1].data).toBe('21');
            expect(files[2].data).toBe('31');
            done();
        });
    });

    it("derive, override processFile, sync, return nothing", function (done) {
        var CustomProcessor = Processor.derive({
            processFile: function (file) {
                file.setData(file.data + 1);
            }
        });
        var processor = new CustomProcessor({
            files: ['**/*.js']
        });

        var builder = new MockBuilder();
        processor.process(builder).then(function () {
            var files = builder.getProcessFiles();
            expect(files[0].data).toBe('11');
            expect(files[1].data).toBe('21');
            expect(files[2].data).toBe('31');
            done();
        });
    });


    it("derive, files should be filter", function (done) {
        var CustomProcessor = Processor.derive({
            processFile: function (file) {
                file.setData(file.data + 1);
            }
        });
        var processor = new CustomProcessor({
            files: ['**/*.js']
        });

        var builder = new MockBuilder();
        processor.process(builder).then(function () {
            var files = builder.getProcessFiles();
            expect(files[0].data).toBe('11');
            expect(files[1].data).toBe('21');
            expect(files[2].data).toBe('31');
            expect(files[3].data).toBe('4');
            done();
        });
    });
});
