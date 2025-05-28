export interface CurseforgeSearchResponse {
	data: CurseforgeMod[];
	pagination: CurseforgePagination;
}

export interface CurseforgeGetModsResponse {
	data: CurseforgeMod[];
}

interface CurseforgePagination {
	index: number;
	pageSize: number;
	resultCount: number;
	totalCount: number;
}

interface CurseforgeMod {
	id: number;
	gameId: number;
	name: string;
	slug: string;
	links: CurseforgeModLinks;
	summary: string;
	status: CurseforgeModStatus;
	downloadCount: number;
	isFeatured: boolean;
	primaryCategoryId: number;
	categories: CurseforgeModCategory[];
	classId: number | null;
	authors: CurseforgeModAuthor[];
	logo: CurseforgeModAsset;
	screenshots: CurseforgeModAsset[];
	mainFileId: number;
	latestFiles: CurseforgeModFile[];
	latestFilesIndexes: CurseforgeModFileIndex[];
	latestEarlyAccessFilesIndexes: CurseforgeModFileIndex[];
	dateCreated: string;
	dateModified: string;
	dateReleased: string;
	allowModDistribution: boolean | null;
	gamePopularityRank: number;
	isAvailable: boolean;
	thumbsUpCount: number;
	rating: number | null;
}

interface CurseforgeModLinks {
	websiteUrl: string;
	wikiUrl: string;
	issuesUr: string;
	sourceUrl: string;
}

enum CurseforgeModStatus {
	New = 1,
	ChangesRequired = 2,
	UnderSoftReview = 3,
	Approved = 4,
	Rejected = 5,
	ChangesMade = 6,
	Inactive = 7,
	Abandoned = 8,
	Deleted = 9,
	UnderReview = 10,
}

interface CurseforgeModCategory {
	id: number;
	gameId: number;
	name: string;
	slug: string;
	url: string;
	iconUrl: string;
	dateModified: string;
	isClass: boolean | null;
	classId: number | null;
	parentCategoryId: number | null;
	displayIndex: number | null;
}

interface CurseforgeModAuthor {
	id: number;
	name: string;
	url: string;
}

interface CurseforgeModAsset {
	id: number;
	modId: number;
	title: string;
	description: string;
	thumbnailUrl: string;
	url: string;
}

interface CurseforgeModFile {
	id: number;
	gameId: number;
	modId: number;
	isAvailable: boolean;
	displayName: string;
	fileName: string;
	releaseType: CurseforgeFileReleaseType;
	fileStatus: CurseforgeFileStatus;
	hashes: CurseforgeFileHash[];
	fileDate: string;
	fileLength: number;
	downloadCount: number;
	fileSizeOnDisk: number;
	gameVersions: string[];
	sortableGameVersions: CurseforgeSortableGameVersion[];
	dependencies: CurseforgeFileDependency[];
	exposeAsAlternative: boolean;
	parentProjectFileId: number | null;
	alternateFileId: number | null;
	isServerPack: boolean | null;
	serverPackFileId: number | null;
	isEarlyAccessContent: boolean | null;
	earlyAccessEndDate: string | null;
	fileFingerprint: number;
	modules: CurseforgeFileModule[];
}

enum CurseforgeFileReleaseType {
	Release = 1,
	Beta = 2,
	Alpha = 3,
}

enum CurseforgeFileStatus {
	Processing = 1,
	ChangesRequired = 2,
	UnderReview = 3,
	Approved = 4,
	Rejected = 5,
	MalwareDetected = 6,
	Deleted = 7,
	Archived = 8,
	Testing = 9,
	Released = 10,
	ReadyForReview = 11,
	Deprecated = 12,
	Baking = 13,
	AwaitingPublishing = 14,
	FailedPublishing = 15,
	Cooking = 16,
	Cooked = 17,
	UnderManualReview = 18,
	ScanningForMalware = 19,
	ProcessingFile = 20,
	PendingRelease = 21,
	ReadyForCooking = 22,
	PostProcessing = 23,
}

interface CurseforgeFileHash {
	value: string;
	algo: CurseforgeHashAlgo;
}

enum CurseforgeHashAlgo {
	Sha1 = 1,
	Md5 = 2,
}

interface CurseforgeSortableGameVersion {
	gameVersionName: string;
	gameVersionPadded: string;
	gameVersion: string;
	gameVersionReleaseDate: string;
	gameVersionTypeId: number | null;
}

interface CurseforgeFileDependency {
	modId: number;
	relationType: CurseforgeFileRelationType;
}

enum CurseforgeFileRelationType {
	EmbeddedLibrary = 1,
	OptionalDependency = 2,
	RequiredDependency = 3,
	Tool = 4,
	Incompatible = 5,
	Include = 6,
}

interface CurseforgeFileModule {
	name: string;
	fingerprint: number;
}

interface CurseforgeModFileIndex {
	gameVersion: string;
	fileId: number;
	fileName: string;
	releaseType: CurseforgeFileReleaseType;
	gameVersionTypeId: number | null;
	modLoader: CurseforgeModLoaderType;
}

export enum CurseforgeModLoaderType {
	Any = 0,
	Forge = 1,
	Cauldron = 2,
	LiteLoader = 3,
	Fabric = 4,
	Quilt = 5,
	NeoForge = 6,
}
