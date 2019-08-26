interface Nekostore {
    collection<T extends {}>(name: string): CollectionReference<T>;
}

type Unsubscribe = () => Promise<void>;

interface CollectionReference<T extends {}, U extends {} | never = never> {
    parent: U extends {} ? DocumentReference<U> : never;
    doc(id: string): DocumentReference<T>;
    add(data: T): Promise<DocumentReference<T>>;
    get(): Promise<QuerySnapshot<T>>;
    onSnapshot(callback: (snapshot: QuerySnapshot<T>) => void): Promise<Unsubscribe>;
}

interface DocumentReference<T extends {}> {
    parent: CollectionReference<T>;
    get(): Promise<DocumentSnapshot<T>>;
    update(data: Partial<T>): Promise<void>;
    remove(): Promise<void>;
    collection<U extends {}>(name: string): CollectionReference<U, T>;
}

interface DocumentSnapshot<T extends {}> {
    ref: DocumentReference<T>;
    id: string;
    exists: boolean;
    userId: string;
    createdAt: number;
    updatedAt: number;
    data?: T;
    onSnapshot(callback: (snapshot: DocumentSnapshot<T>) => void): Promise<Unsubscribe>;
}

type ChangeType = 'added' | 'updated' | 'moved' | 'removed';

interface QueryDocumentSnapshot<T extends {}> extends DocumentSnapshot<T> {
    changeType: ChangeType;
}

interface QuerySnapshot<T extends {}> {
    ref: CollectionReference<T>;
    docs: QueryDocumentSnapshot<T>;
}

// ---------------------------------------------------------------------------------------------------

class DocumentSnapshotImpl<T> implements DocumentSnapshot<T> {
    constructor(
        createdAt :number,
        data :T,
        exists: boolean,
        id: string,
        ref: DocumentReference<T>,
        updatedAt: number,
        userId: string
    ) {
        this.createdAt = createdAt;
        this.data = data;
        this.exists = exists;
        this.id = id;
        this.ref = ref;
        this.updatedAt = updatedAt;
        this.userId = userId;
    }

    createdAt: number;
    data: T;
    exists: boolean;
    id: string;
    ref: DocumentReference<T>;
    updatedAt: number;
    userId: string;

    async onSnapshot(callback: (snapshot: DocumentSnapshot<T>) => void): Promise<Unsubscribe> {
        const func: Unsubscribe = async () => {
            // something
        };
        return func;
    }

}

class QueryDocumentSnapshotImpl<T> extends DocumentSnapshotImpl<T> implements QueryDocumentSnapshot<T> {
    constructor(
        createdAt :number,
        data :T,
        exists: boolean,
        id: string,
        ref: DocumentReference<T>,
        updatedAt: number,
        userId: string,
        changeType: ChangeType
    ) {
        super(
            createdAt,
            data,
            exists,
            id,
            ref,
            updatedAt,
            userId
        );
        this.changeType = changeType
    }
    changeType: ChangeType;
}

class QuerySnapshotImpl<T> implements QuerySnapshot<T> {
    constructor(
        docs: QueryDocumentSnapshot<T>,
        ref: CollectionReference<T>
    ) {
        this.docs = docs;
        this.ref = ref;
    }

    docs: QueryDocumentSnapshot<T>;
    ref: CollectionReference<T>;
}

// class CollectionReferenceImpl<T, never> implements CollectionReference<T, never> {
//     constructor() {
//         declare const n: never;
//         this.parent = new DocumentReferenceImpl<never>(n, this);
//     }
//
//     parent: DocumentReference<never>;
//
//     async add(data: T): Promise<DocumentReference<T>> {
//         return new DocumentReferenceImpl<T>(data, this);
//     }
//
//     doc(id: string): DocumentReference<T> {
//         return new DocumentReferenceImpl<T>(DB.get<T>(), this);
//     }
//
//     async get(): Promise<QuerySnapshot<T>> {
//         const docs: QueryDocumentSnapshot<T> = new QueryDocumentSnapshotImpl();
//         const qs: QuerySnapshotImpl<T> = new QuerySnapshotImpl<T>(this);
//         return qs;
//     }
//
//     async onSnapshot(callback: (snapshot: QuerySnapshot<T>) => void): Promise<Unsubscribe> {
//         return async () => {};
//     }
//
// }
//
// class DocumentReferenceImpl<T> implements DocumentReference<T> {
//     constructor(data :T, parent :CollectionReference<T>) {
//         const ds: DocumentSnapshot<T> = new DocumentSnapshotImpl<T>(
//             20190825,
//             data,
//             true,
//             "ID_00001",
//             this,
//             20190825,
//             "USR_001"
//         );
//         this.data = ds;
//         this.parent = parent;
//     }
//
//     data: DocumentSnapshot<T>;
//     parent: CollectionReference<T>;
//
//     collection<U extends {}>(name: T): CollectionReference<U, T> {
//         return this.child;
//     }
//
//     async get(): Promise<DocumentSnapshot<T>> {
//         return this.data;
//     }
//
//     async remove(): Promise<void> {
//         return;
//     }
//
//     async update(data: Partial<T>): Promise<void> {
//         return;
//     }
// }