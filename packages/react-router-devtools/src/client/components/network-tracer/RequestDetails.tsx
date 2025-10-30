import type React from "react"
import type { RequestEvent } from "../../../shared/request-event"
import { cx } from "../../styles/use-styles"
import { useStyles } from "../../styles/use-styles"
import { METHOD_COLORS } from "../../tabs/TimelineTab"
import { Tag } from "../Tag"
import { Icon } from "../icon/Icon"
import { JsonRenderer } from "../jsonRenderer"

interface RequestDetailsProps {
	request: RequestEvent
	onClose: () => void
	onChangeRequest: (index: number) => void
	total: number
	index: null | number
}

export const RequestDetails: React.FC<RequestDetailsProps> = ({ request, onClose, total, index, onChangeRequest }) => {
	const { styles } = useStyles()

	if (index === null) {
		return
	}

	const typeBadgeColorClass =
		request.type === "loader"
			? styles.network.details.typeBadgeGreen
			: request.type === "client-loader"
				? styles.network.details.typeBadgeBlue
				: request.type === "action"
					? styles.network.details.typeBadgeYellow
					: request.type === "client-action"
						? styles.network.details.typeBadgePurple
						: styles.network.details.typeBadgeWhite

	const duration = request.endTime ? request.endTime - request.startTime : 0

	return (
		<div className={styles.network.details.container}>
			<div className={styles.network.details.content}>
				{/* Header with close button */}
				<div className={styles.network.details.header}>
					<div className={styles.network.details.headerTop}>
						<div className={styles.network.details.headerTitle}>Request Details</div>
						<div className={styles.network.details.controls}>
							<div className={styles.network.details.navButtons}>
								{index > 0 ? (
									<button
										type="button"
										onClick={() => onChangeRequest(index - 1)}
										className={cx(styles.network.details.navButton, styles.network.details.navButtonLeft)}
										title="Previous request"
									>
										<Icon name="ChevronDown" />
									</button>
								) : null}
								{index < total - 1 ? (
									<button
										type="button"
										onClick={() => onChangeRequest(index + 1)}
										className={cx(styles.network.details.navButton, styles.network.details.navButtonRight)}
										title="Next request"
									>
										<Icon name="ChevronDown" />
									</button>
								) : null}
							</div>
							<button type="button" className={styles.network.details.closeButton} onClick={onClose} title="Close">
								<Icon name="X" />
							</button>
						</div>
					</div>

					{/* Main request info */}
					<div className={styles.network.details.mainInfo}>
						<div className={styles.network.details.requestPath}>
							<div className={styles.network.details.requestUrl}>{request.url}</div>
							<div className={styles.network.details.requestId}>ID: {request.id}</div>
						</div>
					</div>
				</div>

				{/* Metadata grid */}
				<div className={styles.network.details.metadataGrid}>
					<div className={styles.network.details.metadataItem}>
						<div className={styles.network.details.metadataLabel}>Method</div>
						<div className={styles.network.details.metadataValue}>
							{request?.method && (
								<Tag className="!px-2 !py-1" color={METHOD_COLORS[request.method]}>
									{request.method}
								</Tag>
							)}
						</div>
					</div>

					<div className={styles.network.details.metadataItem}>
						<div className={styles.network.details.metadataLabel}>Type</div>
						<div className={styles.network.details.metadataValue}>
							{request?.type && (
								<div className={cx(styles.network.details.typeBadge, typeBadgeColorClass)}>{request.type}</div>
							)}
						</div>
					</div>

					<div className={styles.network.details.metadataItem}>
						<div className={styles.network.details.metadataLabel}>Duration</div>
						<div className={styles.network.details.metadataValue}>
							{request.endTime ? (
								<span className={styles.network.details.duration}>{duration.toFixed(0)}ms</span>
							) : (
								<span className={styles.network.details.durationPending}>Pending...</span>
							)}
						</div>
					</div>

					<div className={styles.network.details.metadataItem}>
						<div className={styles.network.details.metadataLabel}>Started</div>
						<div className={styles.network.details.metadataValue}>
							{new Date(request.startTime).toLocaleTimeString()}
						</div>
					</div>

					{request.endTime && (
						<div className={styles.network.details.metadataItem}>
							<div className={styles.network.details.metadataLabel}>Completed</div>
							<div className={styles.network.details.metadataValue}>
								{new Date(request.endTime).toLocaleTimeString()}
							</div>
						</div>
					)}

					{request?.aborted && (
						<div className={styles.network.details.metadataItem}>
							<div className={styles.network.details.metadataLabel}>Status</div>
							<div className={styles.network.details.metadataValue}>
								<div className={cx(styles.network.details.typeBadge, styles.network.details.typeBadgeRed)}>Aborted</div>
							</div>
						</div>
					)}
				</div>

				{/* Data sections */}
				{request.data && (
					<div className={styles.network.details.section}>
						<div className={styles.network.details.sectionHeader}>
							<Icon name="Layers" />
							<span>Response Data</span>
						</div>
						<div className={styles.network.details.sectionContent}>
							<JsonRenderer data={request.data} />
						</div>
					</div>
				)}

				{request.headers && Object.keys(request.headers).length > 0 && (
					<div className={styles.network.details.section}>
						<div className={styles.network.details.sectionHeader}>
							<Icon name="List" />
							<span>Headers</span>
						</div>
						<div className={styles.network.details.sectionContent}>
							<JsonRenderer data={request.headers} />
						</div>
					</div>
				)}
			</div>
		</div>
	)
}
