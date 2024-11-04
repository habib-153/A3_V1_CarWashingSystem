"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
class QueryBuilder {
    constructor(modelQuery, query) {
        this.modelQuery = modelQuery;
        this.query = query;
    }
    search(searchableFields) {
        var _a, _b;
        const searchTerm = (_a = this === null || this === void 0 ? void 0 : this.query) === null || _a === void 0 ? void 0 : _a.searchTerm;
        const searchDate = (_b = this === null || this === void 0 ? void 0 : this.query) === null || _b === void 0 ? void 0 : _b.searchDate;
        // console.log(searchDate)
        if (searchTerm) {
            this.modelQuery = this.modelQuery.find({
                $or: searchableFields.map(field => ({
                    [field]: {
                        $regex: searchTerm, $options: 'i'
                    }
                }))
            });
        }
        return this;
    }
    filter() {
        const queryObj = Object.assign({}, this.query);
        //filtering
        const excludeFields = ['searchTerm', 'sort', 'page', 'limit', 'fields'];
        excludeFields.forEach((el) => delete queryObj[el]);
        if (queryObj.serviceId) {
            this.modelQuery = this.modelQuery.find({ service: queryObj === null || queryObj === void 0 ? void 0 : queryObj.serviceId });
        }
        if (queryObj.date) {
            this.modelQuery = this.modelQuery.find({ date: queryObj === null || queryObj === void 0 ? void 0 : queryObj.date });
        }
        if (queryObj.filters) {
            const filters = queryObj.filters.split(',');
            filters === null || filters === void 0 ? void 0 : filters.forEach((str) => {
                const [key, value] = str.split(' ');
                if (key === 'less' && value === 'than') {
                    const duration = parseInt(str.split(' ')[2], 10);
                    if (!isNaN(duration)) {
                        // console.log(duration)
                        this.modelQuery = this.modelQuery.find({ duration: { $lte: duration } });
                    }
                }
                if (key === 'more' && value === 'than') {
                    const duration = parseInt(str.split(' ')[2], 10);
                    if (!isNaN(duration)) {
                        this.modelQuery = this.modelQuery.find({ duration: { $gt: duration } });
                    }
                }
            });
        }
        //console.log(this.modelQuery)
        return this;
    }
    sort() {
        var _a, _b, _c;
        const sort = ((_c = (_b = (_a = this === null || this === void 0 ? void 0 : this.query) === null || _a === void 0 ? void 0 : _a.sort) === null || _b === void 0 ? void 0 : _b.split(',')) === null || _c === void 0 ? void 0 : _c.join(' ')) || '-createdAt';
        this.modelQuery = this.modelQuery.sort(sort);
        return this;
    }
    paginate() {
        var _a, _b;
        const page = Number((_a = this === null || this === void 0 ? void 0 : this.query) === null || _a === void 0 ? void 0 : _a.page) || 1;
        const limit = Number((_b = this === null || this === void 0 ? void 0 : this.query) === null || _b === void 0 ? void 0 : _b.limit) || 10;
        const skip = (page - 1) * limit;
        this.modelQuery = this.modelQuery.skip(skip).limit(limit);
        return this;
    }
    fields() {
        var _a, _b, _c;
        const fields = ((_c = (_b = (_a = this === null || this === void 0 ? void 0 : this.query) === null || _a === void 0 ? void 0 : _a.fields) === null || _b === void 0 ? void 0 : _b.split(',')) === null || _c === void 0 ? void 0 : _c.join(' ')) || '-__v';
        this.modelQuery = this.modelQuery.select(fields);
        return this;
    }
    countTotal() {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            const totalQueries = this.modelQuery.getFilter();
            const total = yield this.modelQuery.model.countDocuments(totalQueries);
            const page = Number((_a = this === null || this === void 0 ? void 0 : this.query) === null || _a === void 0 ? void 0 : _a.page) || 1;
            const limit = Number((_b = this === null || this === void 0 ? void 0 : this.query) === null || _b === void 0 ? void 0 : _b.limit) || 10;
            const totalPage = Math.ceil(total / limit);
            return {
                total,
                page,
                limit,
                totalPage
            };
        });
    }
}
exports.default = QueryBuilder;
