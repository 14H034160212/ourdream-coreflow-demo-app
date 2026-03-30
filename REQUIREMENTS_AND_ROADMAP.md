# Requirement Update: Realtime AI Video Calls in 1 Week

## Requirement

Ship real-time AI video calls from scratch with <200ms latency within 1 week.

## Honest interpretation

This should be treated as an **MVP performance target** for the fast path:

- realtime room join
- audio/video transport
- interruptible agent loop
- latency instrumentation
- async offloading of expensive generation

It should **not** be treated as a guarantee that full multimodal generation, synthesis, and all network conditions remain below 200ms.

## Scope split

### In scope for week 1
- 1:1 room-based call
- browser mic/camera
- WebRTC transport
- persona selection
- realtime transcript + fast reply loop
- visible memory
- async image/video job queue
- latency metrics UI

### Explicitly out of scope
- photoreal realtime avatar generation
- production-scale SFU operations
- multi-region failover
- guaranteed global p95 < 200ms

## Architecture sketch

1. Browser joins room
2. Audio/video enters low-latency path
3. Transcript or control signals feed a lightweight orchestration layer
4. Fast text/voice response returns immediately
5. Image/video requests route to async queue
6. Metrics panel exposes first-response latency, queue depth, and lane assignment

## Why this is stronger for Coreflow

This demonstrates product and infra judgment:

- protect the realtime path
- separate expensive workloads
- expose queue/cost/latency
- design for future multi-GPU routing

## Resume bullet

Built a 1-week MVP for realtime AI video calls with a sub-200ms fast-path target by combining low-latency WebRTC interaction, controllable memory, and async media job routing.
