# GraphQL — Reserved Slot

Folder ini disiapkan sebagai **slot arsitektur** untuk integrasi GraphQL di masa depan.

## Struktur yang Disiapkan

```
graphql/
├── resolvers/     ← Query & Mutation resolvers (per domain)
├── schemas/       ← SDL schema definitions (.graphql files)
└── dataloaders/   ← DataLoader untuk menghindari N+1 problem
```

## Catatan Arsitektur

- GraphQL layer akan **berbagi Use Cases yang sama** dengan REST layer
- Controllers REST ↔ Resolvers GraphQL → keduanya memanggil Application Use Cases
- Tidak ada duplikasi business logic
- Library yang direkomendasikan: `graphql-yoga` atau `apollo-server-express`

## Status

> ⏳ **Belum diimplementasi** — akan dikerjakan sesuai roadmap Fase 4+
