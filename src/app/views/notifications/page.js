'use client';

import NotificationsTable from './NotificationsTable';
import {
	Link,
	DataTableSkeleton,
	Pagination,
	Column,
	Grid,
} from '@carbon/react';

import React, { useEffect, useState } from 'react';
import { Octokit } from '@octokit/core';

const octokitClient = new Octokit({});

const headers = [
	{
		key: 'name',
		header: 'Name',
	},
	{
		key: 'createdAt',
		header: 'Created',
	},
	{
		key: 'updatedAt',
		header: 'Updated',
	},
];

const LinkList = ({ url, homepageUrl }) => (
	<ul style={{ display: 'flex' }}>
		<li>
			<Link href={url}>GitHub</Link>
		</li>
		{homepageUrl && (
			<li>
				<span>&nbsp;|&nbsp;</span>
				<Link href={homepageUrl}>Homepage</Link>
			</li>
		)}
	</ul>
);

const getRowItems = (rows) =>
	rows.map((row) => ({
		...row,
		key: row.id,
		stars: row.stargazers_count,
		issueCount: row.open_issues_count,
		createdAt: new Date(row.created_at).toLocaleDateString(),
		updatedAt: new Date(row.updated_at).toLocaleDateString(),
		links: <LinkList url={row.html_url} homepageUrl={row.homepage} />,
	}));

function NotificationsPage() {
	const [firstRowIndex, setFirstRowIndex] = useState(0);
	const [currentPageSize, setCurrentPageSize] = useState(10);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState();
	const [rows, setRows] = useState([]);

	useEffect(() => {
		async function getCarbonRepos() {
			const res = await octokitClient.request('GET /orgs/{org}/repos', {
				org: 'carbon-design-system',
				per_page: 75,
				sort: 'updated',
				direction: 'desc',
			});

			if (res.status === 200) {
				setRows(getRowItems(res.data));
			} else {
				setError('Error obtaining repository data');
			}
			setLoading(false);
		}

		getCarbonRepos();
	}, []);

	if (loading) {
		return (
			<Grid className="repo-page">
				<Column lg={16} md={8} sm={4}>
					<DataTableSkeleton
						columnCount={headers.length + 1}
						rowCount={10}
						headers={headers}
					/>
				</Column>
			</Grid>
		);
	}

	if (error) {
		return `Error! ${error}`;
	}

	return (
		<Grid className="repo-page">
			<Column lg={16} md={8} sm={4} className="games-page__r1">
				<NotificationsTable
					headers={headers}
					rows={rows.slice(
						firstRowIndex,
						firstRowIndex + currentPageSize,
					)}
				/>
				<Pagination
					totalItems={rows.length}
					backwardText="Previous page"
					forwardText="Next page"
					pageSize={currentPageSize}
					pageSizes={[5, 10, 15, 25]}
					itemsPerPageText="Items per page"
					onChange={({ page, pageSize }) => {
						if (pageSize !== currentPageSize) {
							setCurrentPageSize(pageSize);
						}
						setFirstRowIndex(pageSize * (page - 1));
					}}
				/>
			</Column>
		</Grid>
	);
}

export default NotificationsPage;
