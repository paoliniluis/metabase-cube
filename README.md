# metabase-cube
Working demo of Metabase and Cube with 3 use cases that are elegantly solved by using both tools

## Data isolation
In Metabase, Data Sources are tied to questions 1:1, so if you have data isolated per schema or database, you can't use Metabase sandboxing. With Cube, you can use sandboxing and still keep the data isolated via schemas, databases or engines, as Cube will act as the connection broker sending the user to the data source it belongs to
![Data isolation use case](.Metabase and Cube-Isolation.png)

## Partitioned tables
If you're using a Data Lake, then you know how expensive it is to query it without using a WHERE clause. Cube allows you to inject SQL statatements on the fly with the user permissions that come from Metabase.
![Partitioned tables use case](.Metabase and Cube-partitioning.png)

## Tiered cachng
In Metabase, you can use App level caching at question or dashboard level, but this might not be sufficient for many users. Cube allows you to do pre-aggregations that will be cached on Cube Store so the queries will never reach the Data Warehouse
![Tiered caching use case](.Metabase and Cube-tiered-caching.png)
